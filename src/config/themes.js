export const invitationThemes = {
  marine: {
    id: 'marine',
    name: 'Marine',
    description: 'Tema laut cerah dengan nuansa cyan, teal, dan coral.',
    primary: '#0077b6',
    accent: '#00b4d8',
    background: '#e0f7fa',
    text: '#003049',
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Tema netral dan tenang untuk berbagai acara keluarga.',
    primary: '#334155',
    accent: '#be8a60',
    background: '#f8fafc',
    text: '#1f2937',
  },
};

export const getInvitationTheme = (themeId) =>
  invitationThemes[themeId] || invitationThemes.marine;
