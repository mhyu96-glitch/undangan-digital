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

  if (isIndexedAudioUrl(standaloneConfig.media?.musicUrl || '')) {
    const record = await getAudioFile(getIndexedAudioId(standaloneConfig.media.musicUrl));
    if (record?.blob) {
      standaloneConfig.media.musicUrl = await fileToDataUrl(record.blob);
    }
  }

  return standaloneConfig;
};

const buildStandaloneInvitationHtml = (standaloneConfig) => {
  const appUrl = new URL('/', window.location.origin);
  appUrl.searchParams.set('mode', 'invite');
  appUrl.searchParams.set('source', 'message');

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${standaloneConfig.title || 'Undangan Digital'}</title>
    <style>
      html, body { margin: 0; min-height: 100%; background: #e0f7fa; }
      iframe { width: 100%; height: 100vh; border: 0; display: block; }
      .fallback { font-family: system-ui, sans-serif; padding: 24px; color: #0f172a; }
    </style>
  </head>
  <body>
    <iframe id="invitationFrame" title="${standaloneConfig.title || 'Undangan Digital'}" src="${appUrl.toString()}" allow="autoplay; clipboard-write"></iframe>
    <noscript><div class="fallback">Aktifkan JavaScript untuk membuka undangan.</div></noscript>
    <script>
      const invitationConfig = ${escapeInlineJson(standaloneConfig)};
      const frame = document.getElementById('invitationFrame');
      const sendConfig = () => {
        frame.contentWindow.postMessage({
          type: 'INVITATION_CONFIG',
          config: invitationConfig
        }, '${window.location.origin}');
      };
      frame.addEventListener('load', sendConfig);
      window.addEventListener('message', (event) => {
        if (event.origin === '${window.location.origin}' && event.data?.type === 'REQUEST_INVITATION_CONFIG') {
          sendConfig();
        }
      });
    </script>
  </body>
</html>`;
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
  const standaloneConfig = await prepareStandaloneConfig(config);
  const html = buildStandaloneInvitationHtml(standaloneConfig);
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

const createZipBlob = (files) => {
  const encoder = new TextEncoder();
  const chunks = [];
  const centralDirectory = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.content);
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
  const standaloneConfig = await prepareStandaloneConfig(config);
  const html = buildStandaloneInvitationHtml(standaloneConfig);
  const zip = createZipBlob([
    { name: 'index.html', content: html },
    { name: '_redirects', content: '/* /index.html 200\n' },
    {
      name: '_headers',
      content: '/\n  Cache-Control: no-store\n\n/index.html\n  Cache-Control: no-store\n',
    },
  ]);

  downloadBlob(zip, filename);
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
