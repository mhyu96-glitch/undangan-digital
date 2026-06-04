import { useMemo, useState } from 'react';
import {
  Calendar,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Gift,
  Image,
  LayoutTemplate,
  MapPin,
  Palette,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import BabyInvitation from '../../BabyInvitation.jsx';
import defaultInvitationConfig from '../config/defaultInvitationConfig.js';
import { getInvitationTheme, invitationThemes } from '../config/themes.js';
import {
  clearBuilderDraft,
  createPublicInvitationUrl,
  downloadConfigJson,
  loadBuilderDraft,
  saveBuilderDraft,
} from '../services/configStorage.js';
import BestMixInvitation from '../templates/BestMixInvitation.jsx';

const cloneConfig = (config) => JSON.parse(JSON.stringify(config));

const mergeConfig = (base, override) => {
  if (!override || typeof override !== 'object') return cloneConfig(base);

  const output = Array.isArray(base) ? [...base] : { ...base };

  Object.entries(override).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      output[key] = mergeConfig(base[key], value);
      return;
    }

    output[key] = value;
  });

  return output;
};

const updateByPath = (source, path, value) => {
  const next = cloneConfig(source);
  const keys = path.split('.');
  let target = next;

  keys.slice(0, -1).forEach((key) => {
    target[key] = target[key] ?? {};
    target = target[key];
  });

  target[keys[keys.length - 1]] = value;
  return next;
};

const eventTypes = [
  { value: 'aqiqah', label: 'Aqiqah' },
  { value: 'ulang-tahun', label: 'Ulang tahun' },
  { value: 'syukuran', label: 'Syukuran' },
  { value: 'tasyakuran', label: 'Tasyakuran' },
  { value: 'khitanan', label: 'Khitanan' },
  { value: 'gathering', label: 'Gathering' },
  { value: 'custom', label: 'Custom' },
];

const animationPresets = [
  {
    id: 'none',
    name: 'None',
    description: 'Tanpa gerakan untuk tampilan yang sangat tenang.',
    className: 'builder-preview-animate-none',
  },
  {
    id: 'gentle-float',
    name: 'Gentle Float',
    description: 'Gerakan naik turun pelan untuk undangan keluarga.',
    className: 'builder-preview-animate-gentle-float',
  },
  {
    id: 'soft-pulse',
    name: 'Soft Pulse',
    description: 'Efek lembut yang membuat cover terasa hidup.',
    className: 'builder-preview-animate-soft-pulse',
  },
  {
    id: 'slide-drift',
    name: 'Slide Drift',
    description: 'Gerakan horizontal tipis untuk tema modern.',
    className: 'builder-preview-animate-slide-drift',
  },
];

const animationIntensity = {
  calm: { label: 'Calm', duration: '6s' },
  normal: { label: 'Normal', duration: '4.5s' },
  lively: { label: 'Lively', duration: '3s' },
};

const builderSections = [
  { id: 'basic', label: 'Basic', icon: Settings2 },
  { id: 'subject', label: 'Subjek', icon: User },
  { id: 'schedule', label: 'Jadwal', icon: Calendar },
  { id: 'location', label: 'Lokasi', icon: MapPin },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'theme', label: 'Tema', icon: Palette },
  { id: 'gift', label: 'Gift', icon: Gift },
  { id: 'sections', label: 'Sections', icon: Eye },
];

const invitationTemplates = [
  {
    id: 'best-mix',
    name: 'Best Mix',
    description: 'Cover Ocean, Profile Glow, Event Glass, Gallery Bento, dan Thanks Gift dalam satu undangan.',
  },
  {
    id: 'classic-marine',
    name: 'Classic Marine',
    description: 'Desain marine awal dengan tab klasik dan animasi bawah laut.',
  },
];

const formatSectionLabel = (section) =>
  section
    .split('-')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');

export default function BuilderPage() {
  const [config, setConfig] = useState(() =>
    mergeConfig(defaultInvitationConfig, loadBuilderDraft()),
  );
  const [activeSection, setActiveSection] = useState('basic');
  const [status, setStatus] = useState('Preview realtime aktif');
  const [importError, setImportError] = useState('');
  const [publicUrl, setPublicUrl] = useState('');

  const theme = getInvitationTheme(config.theme);
  const galleryText = useMemo(() => (config.media.gallery || []).join('\n'), [config.media.gallery]);
  const hostText = useMemo(() => (config.host.names || []).join('\n'), [config.host.names]);

  const setField = (path, value) => {
    setConfig((currentConfig) => updateByPath(currentConfig, path, value));
    setStatus('Preview diperbarui realtime');
  };

  const handleSaveDraft = () => {
    saveBuilderDraft(config);
    const nextPublicUrl = createPublicInvitationUrl(config);
    setPublicUrl(nextPublicUrl);
    setStatus('Draft tersimpan dan link konsumen siap dibagikan');
  };

  const handleCopyPublicUrl = async () => {
    const nextPublicUrl = publicUrl || createPublicInvitationUrl(config);
    setPublicUrl(nextPublicUrl);
    await navigator.clipboard.writeText(nextPublicUrl);
    setStatus('Link konsumen sudah disalin');
  };

  const handleReset = () => {
    clearBuilderDraft();
    setConfig(cloneConfig(defaultInvitationConfig));
    setStatus('Config dikembalikan ke default');
    setImportError('');
    setPublicUrl('');
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedConfig = mergeConfig(defaultInvitationConfig, JSON.parse(text));
      setConfig(importedConfig);
      saveBuilderDraft(importedConfig);
      setStatus('Config berhasil diimport dan disimpan sebagai draft');
      setImportError('');
    } catch {
      setImportError('File JSON tidak valid. Periksa isi config lalu coba lagi.');
    } finally {
      event.target.value = '';
    }
  };

  const setGiftAccountField = (index, field, value) => {
    setConfig((currentConfig) => {
      const next = cloneConfig(currentConfig);
      next.gift.accounts[index] = {
        ...next.gift.accounts[index],
        [field]: value,
      };
      return next;
    });
    setStatus('Preview diperbarui realtime');
  };

  const handleAddGiftAccount = () => {
    setConfig((currentConfig) => {
      const next = cloneConfig(currentConfig);
      next.gift.accounts = [
        ...(next.gift.accounts || []),
        {
          bank: 'BANK',
          number: '',
          name: '',
          copyText: '',
        },
      ];
      return next;
    });
    setStatus('Rekening gift ditambahkan');
  };

  const handleRemoveGiftAccount = (index) => {
    setConfig((currentConfig) => {
      const next = cloneConfig(currentConfig);
      next.gift.accounts = (next.gift.accounts || []).filter((_, itemIndex) => itemIndex !== index);
      return next;
    });
    setStatus('Rekening gift dihapus');
  };

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,#ffffff_0,#eef7fb_34%,#e8edf4_100%)] text-slate-950">
      <header className="border-b border-white/70 bg-white/55 shadow-sm shadow-slate-200/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1 hidden gap-2 sm:flex">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Digital Invitation</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Template Builder</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Atur konten, background, musik, tema, dan animasi. Preview di kanan langsung mengikuti perubahan.
            </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="builder-button" type="button" onClick={handleSaveDraft}>
              <Save size={16} />
              Simpan
            </button>
            <button className="builder-button" type="button" onClick={() => downloadConfigJson(config)}>
              <Download size={16} />
              Export
            </button>
            <label className="builder-button cursor-pointer">
              <Upload size={16} />
              Import
              <input className="sr-only" type="file" accept="application/json" onChange={handleImport} />
            </label>
            <a className="builder-button" href="/templates">
              <LayoutTemplate size={16} />
              Templates
            </a>
            <button className="builder-button" type="button" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 xl:grid-cols-[220px_minmax(0,1fr)_360px]">
        <aside className="builder-panel h-fit xl:sticky xl:top-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Editor</p>
          <nav className="grid gap-2">
            {builderSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  className={`builder-nav-button ${isActive ? 'builder-nav-button-active' : ''}`}
                  type="button"
                  onClick={() => {
                    setActiveSection(section.id);
                    setStatus(`${section.label} aktif. Preview siap mengikuti edit.`);
                  }}
                >
                  <Icon size={17} />
                  {section.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
            <p className="font-semibold text-slate-700">Status</p>
            <p className="mt-1 rounded-2xl bg-white/70 px-3 py-2">{status}</p>
            {importError ? <p className="mt-2 text-red-600">{importError}</p> : null}
          </div>
        </aside>

        <section className="space-y-5">
          {activeSection === 'basic' ? (
            <BuilderPanel
              description="Informasi dasar yang akan muncul di cover dan metadata undangan."
              title="Basic"
            >
              <div className="builder-grid">
                <BuilderField label="Jenis acara">
                  <select
                    className="builder-input"
                    value={config.eventType}
                    onChange={(event) => setField('eventType', event.target.value)}
                  >
                    {eventTypes.map((eventType) => (
                      <option key={eventType.value} value={eventType.value}>
                        {eventType.label}
                      </option>
                    ))}
                  </select>
                </BuilderField>
                <BuilderField label="Nama default tamu">
                  <input
                    className="builder-input"
                    value={config.guest.defaultName}
                    onChange={(event) => setField('guest.defaultName', event.target.value)}
                  />
                </BuilderField>
                <BuilderField className="sm:col-span-2" label="Judul undangan">
                  <input
                    className="builder-input text-lg font-semibold"
                    value={config.title}
                    onChange={(event) => setField('title', event.target.value)}
                  />
                </BuilderField>
                <BuilderField className="sm:col-span-2" label="Subtitle">
                  <textarea
                    className="builder-input min-h-28"
                    value={config.subtitle}
                    onChange={(event) => setField('subtitle', event.target.value)}
                  />
                </BuilderField>
              </div>
            </BuilderPanel>
          ) : null}

          {activeSection === 'subject' ? (
            <BuilderPanel
              description="Data subjek acara dan penyelenggara. Untuk aqiqah bisa bayi dan orang tua, untuk acara lain bisa nama individu atau keluarga."
              title="Subject & Host"
            >
              <div className="builder-grid">
                <BuilderField label="Nama subjek acara">
                  <input
                    className="builder-input"
                    value={config.subject.name}
                    onChange={(event) => setField('subject.name', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Deskripsi subjek">
                  <input
                    className="builder-input"
                    value={config.subject.description}
                    onChange={(event) => setField('subject.description', event.target.value)}
                  />
                </BuilderField>
                <BuilderField className="sm:col-span-2" label="Nama penyelenggara">
                  <textarea
                    className="builder-input min-h-28"
                    value={hostText}
                    onChange={(event) =>
                      setField(
                        'host.names',
                        event.target.value.split('\n').map((item) => item.trim()).filter(Boolean),
                      )
                    }
                  />
                </BuilderField>
              </div>
            </BuilderPanel>
          ) : null}

          {activeSection === 'schedule' ? (
            <BuilderPanel
              description="Atur waktu acara. Label tanggal tampil bisa dibuat lebih manusiawi dari tanggal teknis."
              title="Schedule"
            >
              <div className="builder-grid">
                <BuilderField label="Tanggal">
                  <input
                    className="builder-input"
                    type="date"
                    value={config.schedule.date}
                    onChange={(event) => setField('schedule.date', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Waktu">
                  <input
                    className="builder-input"
                    type="time"
                    value={config.schedule.time}
                    onChange={(event) => setField('schedule.time', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Zona waktu">
                  <input
                    className="builder-input"
                    value={config.schedule.timezone}
                    onChange={(event) => setField('schedule.timezone', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Label tanggal tampil">
                  <input
                    className="builder-input"
                    value={config.schedule.displayDate}
                    onChange={(event) => setField('schedule.displayDate', event.target.value)}
                  />
                </BuilderField>
              </div>
            </BuilderPanel>
          ) : null}

          {activeSection === 'location' ? (
            <BuilderPanel
              description="Masukkan alamat dan link maps. Embed URL dipakai untuk tampilan map di halaman undangan."
              title="Location"
            >
              <div className="builder-grid">
                <BuilderField label="Nama lokasi">
                  <input
                    className="builder-input"
                    value={config.location.name}
                    onChange={(event) => setField('location.name', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Google Maps link">
                  <input
                    className="builder-input"
                    value={config.location.mapsLink}
                    onChange={(event) => setField('location.mapsLink', event.target.value)}
                  />
                </BuilderField>
                <BuilderField className="sm:col-span-2" label="Alamat">
                  <textarea
                    className="builder-input min-h-28"
                    value={config.location.address}
                    onChange={(event) => setField('location.address', event.target.value)}
                  />
                </BuilderField>
                <BuilderField className="sm:col-span-2" label="Google Maps embed URL">
                  <input
                    className="builder-input"
                    value={config.location.mapsEmbedUrl}
                    onChange={(event) => setField('location.mapsEmbedUrl', event.target.value)}
                  />
                </BuilderField>
              </div>
            </BuilderPanel>
          ) : null}

          {activeSection === 'media' ? (
            <BuilderPanel
              description="Gunakan URL aset untuk MVP static. Background dan musik akan terlihat langsung di preview."
              title="Media"
            >
              <div className="builder-grid">
                <BuilderField label="Background image URL">
                  <input
                    className="builder-input"
                    placeholder="https://..."
                    value={config.media.backgroundImage || ''}
                    onChange={(event) => setField('media.backgroundImage', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Cover image URL">
                  <input
                    className="builder-input"
                    value={config.media.coverImage}
                    onChange={(event) => setField('media.coverImage', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Profile image URL">
                  <input
                    className="builder-input"
                    value={config.media.profileImage}
                    onChange={(event) => setField('media.profileImage', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Fallback image URL">
                  <input
                    className="builder-input"
                    value={config.media.fallbackImage}
                    onChange={(event) => setField('media.fallbackImage', event.target.value)}
                  />
                </BuilderField>
                <BuilderField className="sm:col-span-2" label="Music URL">
                  <div className="grid gap-3">
                    <input
                      className="builder-input"
                      placeholder="https://...mp3"
                      value={config.media.musicUrl}
                      onChange={(event) => setField('media.musicUrl', event.target.value)}
                    />
                    {config.media.musicUrl ? (
                      <audio className="w-full" controls key={config.media.musicUrl} src={config.media.musicUrl}>
                        <track kind="captions" />
                      </audio>
                    ) : null}
                  </div>
                </BuilderField>
                <BuilderField className="sm:col-span-2" label="Gallery image URLs">
                  <textarea
                    className="builder-input min-h-36"
                    value={galleryText}
                    onChange={(event) =>
                      setField(
                        'media.gallery',
                        event.target.value.split('\n').map((item) => item.trim()).filter(Boolean),
                      )
                    }
                  />
                </BuilderField>
              </div>
            </BuilderPanel>
          ) : null}

          {activeSection === 'theme' ? (
            <BuilderPanel
              description="Pilih tema dan animasi. Pilihan ini sudah ikut masuk ke config JSON."
              title="Theme & Animation"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <LayoutTemplate size={18} className="text-sky-700" />
                    Template
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {invitationTemplates.map((item) => {
                      const isSelected = (config.template || 'best-mix') === item.id;

                      return (
                        <button
                          key={item.id}
                          className={`builder-bento-card ${isSelected ? 'builder-bento-card-active' : ''}`}
                          type="button"
                          onClick={() => setField('template', item.id)}
                        >
                          <span className="font-semibold">{item.name}</span>
                          <span className="mt-2 block text-sm leading-5 text-slate-600">{item.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.values(invitationThemes).map((item) => {
                    const isSelected = config.theme === item.id;

                    return (
                      <button
                        key={item.id}
                        className={`builder-bento-card ${isSelected ? 'builder-bento-card-active' : ''}`}
                        type="button"
                        onClick={() => setField('theme', item.id)}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="h-5 w-5 border border-white shadow"
                            style={{ backgroundColor: item.primary }}
                          />
                          <span className="font-semibold">{item.name}</span>
                        </span>
                        <span className="mt-2 block text-sm leading-5 text-slate-600">{item.description}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Sparkles size={18} className="text-sky-700" />
                      Animation preset
                    </h3>
                    <label className="builder-pill">
                      Intensity
                      <select
                        className="min-w-28 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none"
                        value={config.animation?.intensity || 'normal'}
                        onChange={(event) => setField('animation.intensity', event.target.value)}
                      >
                        {Object.entries(animationIntensity).map(([value, item]) => (
                          <option key={value} value={value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {animationPresets.map((preset) => {
                      const isSelected = config.animation?.preset === preset.id;

                      return (
                        <button
                          key={preset.id}
                          className={`builder-bento-card ${isSelected ? 'builder-bento-card-active' : ''}`}
                          type="button"
                          onClick={() => setField('animation.preset', preset.id)}
                        >
                          <span className={`mb-3 block h-12 overflow-hidden rounded-2xl bg-slate-100 ${preset.className}`}>
                            <span
                              className="mx-auto block h-12 w-12 rounded-full"
                              style={{ backgroundColor: theme.accent }}
                            />
                          </span>
                          <span className="font-semibold">{preset.name}</span>
                          <span className="mt-1 block text-sm leading-5 text-slate-600">{preset.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </BuilderPanel>
          ) : null}

          {activeSection === 'gift' ? (
            <BuilderPanel
              description="Amplop digital dan ucapan WhatsApp untuk MVP tanpa backend."
              title="Gift & Wishes"
            >
              <div className="builder-grid">
                <ToggleField
                  checked={config.gift.enabled}
                  label="Aktifkan amplop digital"
                  onChange={(checked) => setField('gift.enabled', checked)}
                />
                <ToggleField
                  checked={config.wishes.enabled}
                  label="Aktifkan ucapan WhatsApp"
                  onChange={(checked) => setField('wishes.enabled', checked)}
                />
                <BuilderField label="Nomor WhatsApp penerima">
                  <input
                    className="builder-input"
                    placeholder="6281234567890"
                    value={config.wishes.whatsappNumber}
                    onChange={(event) => setField('wishes.whatsappNumber', event.target.value)}
                  />
                </BuilderField>
                <BuilderField label="Template pesan ucapan">
                  <input
                    className="builder-input"
                    value={config.wishes.defaultMessage}
                    onChange={(event) => setField('wishes.defaultMessage', event.target.value)}
                  />
                </BuilderField>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-950">Rekening amplop digital</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Nomor copy bisa diisi tanpa spasi atau tanda hubung agar mudah ditempel.
                    </p>
                  </div>
                  <button className="builder-button" type="button" onClick={handleAddGiftAccount}>
                    <Plus size={16} />
                    Tambah
                  </button>
                </div>

                <div className="space-y-4">
                  {(config.gift.accounts || []).map((account, index) => (
                    <div key={`${account.bank}-${index}`} className="builder-bento-card">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-800">Rekening {index + 1}</p>
                        <button
                          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-50"
                          type="button"
                          onClick={() => handleRemoveGiftAccount(index)}
                        >
                          <Trash2 size={15} />
                          Hapus
                        </button>
                      </div>
                      <div className="builder-grid">
                        <BuilderField label="Bank">
                          <input
                            className="builder-input"
                            value={account.bank}
                            onChange={(event) => setGiftAccountField(index, 'bank', event.target.value)}
                          />
                        </BuilderField>
                        <BuilderField label="Nama pemilik">
                          <input
                            className="builder-input"
                            value={account.name}
                            onChange={(event) => setGiftAccountField(index, 'name', event.target.value)}
                          />
                        </BuilderField>
                        <BuilderField label="Nomor tampil">
                          <input
                            className="builder-input"
                            value={account.number}
                            onChange={(event) => setGiftAccountField(index, 'number', event.target.value)}
                          />
                        </BuilderField>
                        <BuilderField label="Nomor copy">
                          <input
                            className="builder-input"
                            value={account.copyText}
                            onChange={(event) => setGiftAccountField(index, 'copyText', event.target.value)}
                          />
                        </BuilderField>
                      </div>
                    </div>
                  ))}

                  {config.gift.accounts?.length ? null : (
                    <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-600">
                      Belum ada rekening. Klik Tambah untuk membuat amplop digital.
                    </div>
                  )}
                </div>
              </div>
            </BuilderPanel>
          ) : null}

          {activeSection === 'sections' ? (
            <BuilderPanel
              description="Matikan section yang tidak dipakai untuk jenis acara tertentu."
              title="Sections"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(config.sections).map(([section, enabled]) => (
                  <ToggleField
                    key={section}
                    checked={enabled}
                    label={formatSectionLabel(section)}
                    onChange={(checked) => setField(`sections.${section}`, checked)}
                  />
                ))}
              </div>
            </BuilderPanel>
          ) : null}
        </section>

        <LivePreview config={config} onCopyPublicUrl={handleCopyPublicUrl} publicUrl={publicUrl} />
      </div>
    </main>
  );
}

function LivePreview({ config, onCopyPublicUrl, publicUrl }) {
  const isClassic = config.template === 'classic-marine';
  const previewKey = `${config.template}-${config.theme}-${config.animation?.preset}-${config.animation?.intensity}`;
  const activePublicUrl = publicUrl || createPublicInvitationUrl(config);

  return (
    <aside className="xl:sticky xl:top-5 xl:self-start">
      <section className="builder-panel">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Realtime</p>
            <h2 className="text-lg font-bold text-slate-950">Live Preview</h2>
            <p className="mt-1 inline-flex rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              {isClassic ? 'Classic Marine' : 'Best Mix'}
            </p>
          </div>
          <a
            className="builder-pill text-sky-800"
            href={activePublicUrl}
            onClick={() => saveBuilderDraft(config)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={15} />
            Buka undangan
          </a>
        </div>

        <div className="mb-4 rounded-[22px] border border-white/70 bg-white/70 p-3 shadow-sm shadow-slate-200/70 backdrop-blur-xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Link Konsumen</p>
          <div className="flex gap-2">
            <input
              className="builder-input min-w-0 flex-1 py-2 text-xs"
              readOnly
              value={activePublicUrl}
            />
            <button className="builder-button shrink-0 px-3" type="button" onClick={onCopyPublicUrl} aria-label="Copy link konsumen">
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[312px]">
          <div className="rounded-[38px] border border-slate-900 bg-slate-950 p-2 shadow-[0_22px_60px_rgba(15,23,42,0.24)]">
            <div className="relative overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900">
              <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-950" />
              <div className="pointer-events-none absolute right-3 top-3 z-50 h-2 w-2 rounded-full bg-slate-700" />
              <div className="h-[640px] overflow-hidden">
                {isClassic ? (
                  <BabyInvitation key={previewKey} config={config} />
                ) : (
                  <BestMixInvitation key={previewKey} config={config} preview />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}

function BuilderPanel({ children, description, title }) {
  return (
    <section className="builder-panel">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function BuilderField({ children, className = '', label }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({ checked, label, onChange }) {
  return (
    <label className="builder-toggle">
      <span className="font-semibold text-slate-700">{label}</span>
      <input
        checked={checked}
        className="h-5 w-5 accent-sky-700"
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
