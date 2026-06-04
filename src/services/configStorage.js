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

export const downloadStandaloneInvitationHtml = (config, filename = 'index.html') => {
  const appUrl = new URL('/', window.location.origin);
  appUrl.searchParams.set('mode', 'invite');
  appUrl.searchParams.set('source', 'message');

  const html = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.title || 'Undangan Digital'}</title>
    <style>
      html, body { margin: 0; min-height: 100%; background: #e0f7fa; }
      iframe { width: 100%; height: 100vh; border: 0; display: block; }
      .fallback { font-family: system-ui, sans-serif; padding: 24px; color: #0f172a; }
    </style>
  </head>
  <body>
    <iframe id="invitationFrame" title="${config.title || 'Undangan Digital'}" src="${appUrl.toString()}" allow="autoplay; clipboard-write"></iframe>
    <noscript><div class="fallback">Aktifkan JavaScript untuk membuka undangan.</div></noscript>
    <script>
      const invitationConfig = ${escapeInlineJson(config)};
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

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
