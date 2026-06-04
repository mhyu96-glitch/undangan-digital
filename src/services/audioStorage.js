const DB_NAME = 'digital-invitation-audio';
const DB_VERSION = 1;
const STORE_NAME = 'audio-files';
export const INDEXED_AUDIO_PREFIX = 'indexed-audio:';

const openAudioDb = () =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const createIndexedAudioUrl = (id) => `${INDEXED_AUDIO_PREFIX}${id}`;

export const isIndexedAudioUrl = (url = '') => url.startsWith(INDEXED_AUDIO_PREFIX);

export const getIndexedAudioId = (url = '') => url.replace(INDEXED_AUDIO_PREFIX, '');

export const saveAudioFile = async (file) => {
  const db = await openAudioDb();
  const id = `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(
      {
        blob: file,
        name: file.name,
        type: file.type,
        size: file.size,
        savedAt: new Date().toISOString(),
      },
      id,
    );
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
  return createIndexedAudioUrl(id);
};

export const getAudioFile = async (id) => {
  const db = await openAudioDb();

  const record = await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });

  db.close();
  return record;
};

export const createObjectUrlFromIndexedAudio = async (url) => {
  if (!isIndexedAudioUrl(url)) return '';
  const record = await getAudioFile(getIndexedAudioId(url));
  return record?.blob ? URL.createObjectURL(record.blob) : '';
};
