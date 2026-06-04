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
  const url = new URL('/invite', window.location.origin);
  url.searchParams.set('c', encodePublicConfig(config));

  if (guestName.trim()) {
    url.searchParams.set('to', guestName.trim());
  }

  return url.toString();
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
