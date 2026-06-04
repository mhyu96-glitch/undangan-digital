export const isDirectAudioUrl = (url = '') =>
  /^data:audio\//i.test(url.trim()) ||
  /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(url.trim());

export const isSoundCloudUrl = (url = '') =>
  /^https?:\/\/(www\.)?soundcloud\.com\//i.test(url.trim());

export const getSoundCloudEmbedUrl = (url = '') => {
  if (!isSoundCloudUrl(url)) return '';
  const params = new URLSearchParams({
    url: url.trim(),
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    visual: 'false',
  });

  return `https://w.soundcloud.com/player/?${params.toString()}`;
};
