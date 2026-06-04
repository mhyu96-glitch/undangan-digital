const BUILDER_DRAFT_KEY = 'digital-invitation-builder:draft';

const encodeUnicodeBase64 = (value) =>
  window.btoa(unescape(encodeURIComponent(value)));

const decodeUnicodeBase64 = (value) =>
  decodeURIComponent(escape(window.atob(value)));

export const loadBuilderDraft = () => {
  try {
    const savedDraft = window.localStorage.getItem(BUILDER_DRAFT_KEY);
    return savedDraft ? JSON.parse(savedDraft) : null;
  } catch (error) {
    console.warn('Failed to load builder draft:', error);
    return null;
  }
};

export const saveBuilderDraft = (config) => {
  window.localStorage.setItem(BUILDER_DRAFT_KEY, JSON.stringify(config, null, 2));
};

export const clearBuilderDraft = () => {
  window.localStorage.removeItem(BUILDER_DRAFT_KEY);
};

export const encodePublicConfig = (config) =>
  encodeUnicodeBase64(JSON.stringify(config));

export const decodePublicConfig = (encodedConfig) => {
  try {
    return JSON.parse(decodeUnicodeBase64(encodedConfig));
  } catch (error) {
    console.warn('Failed to decode public invitation config:', error);
    return null;
  }
};

export const loadPublicConfigFromUrl = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const encodedConfig = params.get('c');
  return encodedConfig ? decodePublicConfig(encodedConfig) : null;
};

export const createPublicInvitationUrl = (config, guestName = '') => {
  const url = new URL('/', window.location.origin);
  url.searchParams.set('mode', 'invite');
  url.searchParams.set('c', encodePublicConfig(config));

  if (guestName.trim()) {
    url.searchParams.set('to', guestName.trim());
  }

  return url.toString();
};

export const createLocalInvitationUrl = () => {
  const url = new URL('/', window.location.origin);
  url.searchParams.set('mode', 'invite');
  return url.toString();
};

const escapeInlineJson = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const prepareStandaloneConfig = async (config) => {
  const { getAudioFile, getIndexedAudioId, isIndexedAudioUrl } = await import('./audioStorage.js');
  const standaloneConfig = JSON.parse(JSON.stringify(config));
  const metadata = {
    audioEmbedded: false,
    audioName: '',
    audioSize: 0,
  };

  if (isIndexedAudioUrl(standaloneConfig.media?.musicUrl || '')) {
    const record = await getAudioFile(getIndexedAudioId(standaloneConfig.media.musicUrl));
    if (!record?.blob) {
      const error = new Error('Imported audio not found in this browser');
      error.code = 'IMPORTED_AUDIO_NOT_FOUND';
      throw error;
    }

    standaloneConfig.media.musicUrl = await fileToDataUrl(record.blob);
    standaloneConfig.media.musicName = record.name || standaloneConfig.media.musicName || 'audio-import';
    standaloneConfig.media.musicSize = record.size || standaloneConfig.media.musicSize || record.blob.size || 0;
    metadata.audioEmbedded = true;
    metadata.audioName = standaloneConfig.media.musicName;
    metadata.audioSize = standaloneConfig.media.musicSize;
  }

  return { metadata, standaloneConfig };
};

const buildStandaloneInvitationHtml = (standaloneConfig, assets = { scripts: [], styles: [] }) => {
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${standaloneConfig.title || 'Undangan Digital'}</title>
    ${assets.styles.map((asset) => `<link rel="stylesheet" href="/${asset.name}" />`).join('\n    ')}
    <style>
      html, body { margin: 0; min-height: 100%; background: #e0f7fa; }
      .fallback { font-family: system-ui, sans-serif; padding: 24px; color: #0f172a; }
    </style>
  </head>
  <body class="font-sans-clean antialiased">
    <div id="root"></div>
    <noscript><div class="fallback">Aktifkan JavaScript untuk membuka undangan.</div></noscript>
    <script>
      window.__INVITATION_STANDALONE__ = true;
      window.__INVITATION_CONFIG__ = ${escapeInlineJson(standaloneConfig)};
    </script>
    ${assets.scripts.map((asset) => `<script type="module" crossorigin src="/${asset.name}"></script>`).join('\n    ')}
  </body>
</html>`;
};

const getAssetNameFromUrl = (url) => {
  const assetUrl = new URL(url, window.location.href);
  return assetUrl.pathname.replace(/^\/+/, '');
};

const getCurrentBuildAssetUrls = () => {
  const urls = [
    ...Array.from(document.querySelectorAll('link[rel="stylesheet"][href]')).map((node) => node.href),
    ...Array.from(document.querySelectorAll('script[type="module"][src]')).map((node) => node.src),
  ].filter((url) => {
    const assetUrl = new URL(url, window.location.href);
    return assetUrl.origin === window.location.origin && assetUrl.pathname.startsWith('/assets/');
  });

  if (!urls.length) {
    const error = new Error('Production assets not found');
    error.code = 'PRODUCTION_ASSETS_NOT_FOUND';
    throw error;
  }

  return urls;
};

const extractRelativeAssetUrls = (content, baseUrl) => {
  const assetUrls = [];
  const assetPattern = /["'](\.\/[^"']+\.(?:js|css|woff2?|png|jpe?g|svg|webp|gif))["']/gi;
  let match = assetPattern.exec(content);

  while (match) {
    assetUrls.push(new URL(match[1], baseUrl).toString());
    match = assetPattern.exec(content);
  }

  return assetUrls;
};

const collectStandaloneAssets = async () => {
  const queuedUrls = [...getCurrentBuildAssetUrls()];
  const seenUrls = new Set();
  const assets = [];

  while (queuedUrls.length) {
    const url = queuedUrls.shift();
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    const response = await fetch(url);
    if (!response.ok) {
      const error = new Error(`Failed to fetch asset ${url}`);
      error.code = 'ASSET_FETCH_FAILED';
      throw error;
    }

    const contentType = response.headers.get('content-type') || '';
    const bytes = new Uint8Array(await response.arrayBuffer());
    const name = getAssetNameFromUrl(url);
    assets.push({
      bytes,
      contentType,
      isScript: name.endsWith('.js'),
      isStyle: name.endsWith('.css'),
      name,
    });

    if (name.endsWith('.js') || name.endsWith('.css')) {
      const content = new TextDecoder().decode(bytes);
      extractRelativeAssetUrls(content, url).forEach((assetUrl) => {
        if (!seenUrls.has(assetUrl)) queuedUrls.push(assetUrl);
      });
    }
  }

  return {
    files: assets,
    scripts: assets.filter((asset) => asset.isScript && getCurrentBuildAssetUrls().includes(new URL(`/${asset.name}`, window.location.origin).toString())),
    styles: assets.filter((asset) => asset.isStyle && getCurrentBuildAssetUrls().includes(new URL(`/${asset.name}`, window.location.origin).toString())),
  };
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const downloadStandaloneInvitationHtml = async (config, filename = 'index.html') => {
  const { standaloneConfig } = await prepareStandaloneConfig(config);
  const assets = await collectStandaloneAssets();
  const html = buildStandaloneInvitationHtml(standaloneConfig, assets);
  const blob = new Blob([html], { type: 'text/html' });
  downloadBlob(blob, filename);
};

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
};

const writeUint16 = (bytes, offset, value) => {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
};

const writeUint32 = (bytes, offset, value) => {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
};

const concatBytes = (chunks) => {
  const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });

  return output;
};

const toZipBytes = (content, encoder) => {
  if (content instanceof Uint8Array) return content;
  if (content instanceof ArrayBuffer) return new Uint8Array(content);
  return encoder.encode(content);
};

const createZipBlob = (files) => {
  const encoder = new TextEncoder();
  const chunks = [];
  const centralDirectory = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = toZipBytes(file.content, encoder);
    const checksum = crc32(dataBytes);
    const localHeader = new Uint8Array(30 + nameBytes.length);

    writeUint32(localHeader, 0, 0x04034b50);
    writeUint16(localHeader, 4, 20);
    writeUint16(localHeader, 8, 0);
    writeUint32(localHeader, 14, checksum);
    writeUint32(localHeader, 18, dataBytes.length);
    writeUint32(localHeader, 22, dataBytes.length);
    writeUint16(localHeader, 26, nameBytes.length);
    localHeader.set(nameBytes, 30);

    chunks.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    writeUint32(centralHeader, 0, 0x02014b50);
    writeUint16(centralHeader, 4, 20);
    writeUint16(centralHeader, 6, 20);
    writeUint32(centralHeader, 16, checksum);
    writeUint32(centralHeader, 20, dataBytes.length);
    writeUint32(centralHeader, 24, dataBytes.length);
    writeUint16(centralHeader, 28, nameBytes.length);
    writeUint32(centralHeader, 42, offset);
    centralHeader.set(nameBytes, 46);
    centralDirectory.push(centralHeader);

    offset += localHeader.length + dataBytes.length;
  });

  const centralDirectoryOffset = offset;
  const centralDirectoryBytes = concatBytes(centralDirectory);
  chunks.push(centralDirectoryBytes);

  const endRecord = new Uint8Array(22);
  writeUint32(endRecord, 0, 0x06054b50);
  writeUint16(endRecord, 8, files.length);
  writeUint16(endRecord, 10, files.length);
  writeUint32(endRecord, 12, centralDirectoryBytes.length);
  writeUint32(endRecord, 16, centralDirectoryOffset);
  chunks.push(endRecord);

  return new Blob([concatBytes(chunks)], { type: 'application/zip' });
};

export const downloadStandaloneInvitationZip = async (config, filename = 'undangan-cloudflare.zip') => {
  const { metadata, standaloneConfig } = await prepareStandaloneConfig(config);
  const assets = await collectStandaloneAssets();
  const html = buildStandaloneInvitationHtml(standaloneConfig, assets);
  const zip = createZipBlob([
    { name: 'index.html', content: html },
    ...assets.files.map((asset) => ({ name: asset.name, content: asset.bytes })),
    { name: '_redirects', content: '/* /index.html 200\n' },
    {
      name: '_headers',
      content: '/\n  Cache-Control: no-store\n\n/index.html\n  Cache-Control: no-store\n',
    },
  ]);

  downloadBlob(zip, filename);
  return {
    ...metadata,
    filename,
    packageSize: zip.size,
  };
};

export const downloadConfigJson = (config, filename = 'invitation-config.json') => {
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
