import { isIndexedAudioUrl } from './audioStorage.js';

export const isDirectAudioUrl = (url = '') =>
  isIndexedAudioUrl(url.trim()) ||
  /^data:audio\//i.test(url.trim()) ||
  /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(url.trim());

export const isSoundCloudUrl = (url = '') =>
  /^https?:\/\/(www\.)?soundcloud\.com\//i.test(url.trim());

export const normalizeImageUrl = (url = '') => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';

  const imgurMatch = trimmedUrl.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpeg`;
  }

  const imgurDirectWithoutExtension = trimmedUrl.match(/^https?:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurDirectWithoutExtension) {
    return `https://i.imgur.com/${imgurDirectWithoutExtension[1]}.jpeg`;
  }

  return trimmedUrl;
};

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
