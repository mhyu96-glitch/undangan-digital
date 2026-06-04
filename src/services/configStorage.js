const BUILDER_DRAFT_KEY = 'digital-invitation-builder:draft';

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
