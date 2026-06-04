import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Baby,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Heart,
  HelpCircle,
  MapPin,
  Music,
  Navigation,
  Send,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  Waves,
  XCircle,
} from 'lucide-react';
import { getGuestNameFromUrl } from '../services/guestName.js';

const navItems = [
  { id: 'cover', label: 'Cover', icon: Sparkles, section: 'cover' },
  { id: 'profile', label: 'Profil', icon: Baby, section: 'profile' },
  { id: 'event', label: 'Acara', icon: Calendar, section: 'event' },
  { id: 'wishes', label: 'Ucapan', icon: Send, section: 'wishes' },
  { id: 'thanks', label: 'Thanks', icon: Heart, section: 'closing' },
];

const getActiveNav = (config) =>
  navItems.filter((item) => {
    if (item.id === 'wishes') return config.sections?.gallery || (config.sections?.wishes && config.wishes?.enabled);
    if (item.id === 'thanks') return config.sections?.closing || (config.sections?.gift && config.gift?.enabled);
    return config.sections?.[item.section];
  });

const getEventTitle = (config) => config.title?.replace(/^Undangan\s+/i, '') || config.title;

const formatTimeZone = (timezone) => {
  if (timezone?.includes('Makassar')) return 'WITA';
  if (timezone?.includes('Jakarta')) return 'WIB';
  return timezone || '';
};

const animationClassByPreset = {
  'gentle-float': 'best-live-animation-gentle-float',
  'soft-pulse': 'best-live-animation-soft-pulse',
  'slide-drift': 'best-live-animation-slide-drift',
};

const animationDurationByIntensity = {
  calm: '6s',
  normal: '4.5s',
  lively: '3s',
};

const getTargetDate = (schedule) => new Date(`${schedule.date}T${schedule.time}:00`).getTime();

function useCountdown(schedule) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = getTargetDate(schedule);

    const update = () => {
      const diff = targetDate - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [schedule]);

  return timeLeft;
}

function OceanBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00daf3] via-[#0070ea] to-[#006875]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.76),transparent_42%)] opacity-70" />
      <div className="best-bubble absolute left-[12%] top-[18%] h-5 w-5 rounded-full bg-white/35 blur-[1px]" />
      <div className="best-bubble absolute left-[72%] top-[64%] h-7 w-7 rounded-full bg-white/24 blur-[1px] [animation-delay:1.7s]" />
      <div className="best-bubble absolute left-[42%] top-[80%] h-3 w-3 rounded-full bg-white/38 [animation-delay:3.1s]" />
      <Waves className="best-float absolute -bottom-3 left-6 h-16 w-16 text-white/20" />
      <Waves className="best-float absolute -bottom-5 right-8 h-20 w-20 text-white/18 [animation-delay:1.5s]" />
    </div>
  );
}

function BestMixStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes bestFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes bestBubble {
        0% { transform: translateY(0) scale(.8); opacity: .2; }
        45% { opacity: .55; }
        100% { transform: translateY(-160px) scale(1.1); opacity: 0; }
      }

      .best-float { animation: bestFloat 6s ease-in-out infinite; }
      .best-bubble { animation: bestBubble 9s linear infinite; }

      @keyframes bestLiveGentleFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }

      @keyframes bestLiveSoftPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.035); }
      }

      @keyframes bestLiveSlideDrift {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(12px); }
      }

      .best-live-animation-gentle-float {
        animation: bestLiveGentleFloat var(--best-live-duration, 4.5s) ease-in-out infinite;
        will-change: transform;
      }

      .best-live-animation-soft-pulse {
        animation: bestLiveSoftPulse var(--best-live-duration, 4.5s) ease-in-out infinite;
        transform-origin: center top;
        will-change: transform;
      }

      .best-live-animation-slide-drift {
        animation: bestLiveSlideDrift var(--best-live-duration, 4.5s) ease-in-out infinite;
        will-change: transform;
      }

      .best-glass {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.32);
        box-shadow: 0 18px 46px rgba(0, 89, 187, 0.16);
      }

      .best-primary-button {
        min-height: 52px;
        display: inline-flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border-radius: 9999px;
        background: #00e5ff;
        color: #001f24;
        font-size: 14px;
        font-weight: 900;
        box-shadow: 0 14px 28px rgba(0, 229, 255, 0.26);
        transition: transform 180ms ease, box-shadow 180ms ease;
      }

      .best-primary-button:active,
      .best-status-button:active {
        transform: scale(.95);
      }

      .best-input {
        width: 100%;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,.3);
        background: rgba(255,255,255,.12);
        padding: 14px 18px;
        color: white;
        outline: none;
      }

      .best-input::placeholder { color: rgba(255,255,255,.55); }

      .best-status-button {
        min-height: 68px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,.28);
        background: rgba(255,255,255,.08);
        color: white;
        font-size: 11px;
        font-weight: 800;
        transition: transform 180ms ease, background 180ms ease;
      }

      .best-status-button-active {
        background: rgba(0, 229, 255, .92);
        color: #001f24;
      }

      .best-bottom-nav {
        background: linear-gradient(135deg, rgba(0, 112, 234, 0.9), rgba(0, 104, 117, 0.94));
        border-top: 1px solid rgba(156, 240, 255, 0.45);
        box-shadow: 0 -14px 34px rgba(0, 31, 36, 0.26);
      }

      .best-nav-item {
        color: rgba(255, 255, 255, 0.74);
      }

      .best-nav-icon-active {
        background: linear-gradient(135deg, #f5cd00, #00e5ff);
        color: #001f24;
        box-shadow: 0 8px 20px rgba(0, 229, 255, 0.28);
      }

      @media (prefers-reduced-motion: reduce) {
        .best-float,
        .best-bubble,
        .best-live-animation-gentle-float,
        .best-live-animation-soft-pulse,
        .best-live-animation-slide-drift {
          animation: none !important;
        }
      }
    ` }} />
  );
}

function CountdownGrid({ schedule }) {
  const timeLeft = useCountdown(schedule);
  const items = [
    [String(timeLeft.days).padStart(2, '0'), 'Hari'],
    [String(timeLeft.hours).padStart(2, '0'), 'Jam'],
    [String(timeLeft.minutes).padStart(2, '0'), 'Menit'],
    [String(timeLeft.seconds).padStart(2, '0'), 'Detik'],
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(([value, label]) => (
        <div key={label} className="text-center">
          <div className="best-glass flex h-16 items-center justify-center rounded-full">
            <span className="text-2xl font-black">{value}</span>
          </div>
          <p className="mt-2 text-[10px] font-bold uppercase text-white/75">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function BestMixInvitation({ config, preview = false }) {
  const activeNav = getActiveNav(config);
  const [isOpen, setIsOpen] = useState(() => preview || !config.sections?.cover);
  const [activeSection, setActiveSection] = useState(() => {
    if (preview) return activeNav.find((item) => item.id !== 'cover')?.id || activeNav[0]?.id || 'cover';
    return activeNav[0]?.id || 'cover';
  });
  const [guestName, setGuestName] = useState(config.guest?.defaultName || 'Bapak/Ibu/Saudara/i');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState('');
  const [toast, setToast] = useState('');
  const [formStatus, setFormStatus] = useState('Hadir');
  const [formName, setFormName] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [wishes, setWishes] = useState([
    {
      name: 'Keluarga Besar Baiman',
      status: 'Hadir',
      message: 'Selamat atas tasyakuran aqiqah. Semoga tumbuh sehat dan menjadi anak sholeh.',
    },
    {
      name: 'Ahmad Rizky & Istri',
      status: 'Hadir',
      message: 'Barakallahu fiikum. Semoga acara berjalan lancar dan penuh keberkahan.',
    },
  ]);
  const audioRef = useRef(null);
  const gallery = useMemo(() => config.media.gallery || [], [config.media.gallery]);
  const liveAnimationClass = animationClassByPreset[config.animation?.preset] || '';
  const liveAnimationStyle = {
    '--best-live-duration': animationDurationByIntensity[config.animation?.intensity] || animationDurationByIntensity.normal,
  };
  const handleImageError = (event) => {
    if (event.currentTarget.src !== config.media.fallbackImage) {
      event.currentTarget.src = config.media.fallbackImage;
    }
  };

  useEffect(() => {
    setGuestName(getGuestNameFromUrl(config.guest?.defaultName || 'Bapak/Ibu/Saudara/i'));

    if (!preview && config.media.musicUrl) {
      audioRef.current = new Audio(config.media.musicUrl);
      audioRef.current.loop = true;
    }

    return () => audioRef.current?.pause();
  }, [config.guest?.defaultName, config.media.musicUrl, preview]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  };

  const openInvitation = () => {
    setIsOpen(true);
    setActiveSection(activeNav.find((item) => item.id !== 'cover')?.id || 'profile');
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const copyAccount = async (account) => {
    const text = account.copyText || account.number;
    await navigator.clipboard.writeText(text);
    setCopiedAccount(account.number);
    showToast('Nomor rekening tersalin');
    setTimeout(() => setCopiedAccount(''), 2200);
  };

  const submitWish = (event) => {
    event.preventDefault();
    if (!formName.trim() || !formMessage.trim()) {
      showToast('Nama dan ucapan wajib diisi');
      return;
    }

    if (config.wishes?.whatsappNumber) {
      const message = `${config.wishes.defaultMessage || ''}\n\nNama: ${formName}\nStatus: ${formStatus}\nUcapan: ${formMessage}`.trim();
      window.open(`https://wa.me/${config.wishes.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    }

    setWishes((currentWishes) => [
      {
        name: formName,
        status: formStatus,
        message: formMessage,
      },
      ...currentWishes,
    ]);
    setFormName('');
    setFormMessage('');
    showToast("Do'a & ucapan tersimpan");
  };

  return (
    <div
      className={`relative w-full max-w-md mx-auto overflow-hidden bg-[#006875] font-sans-clean text-white shadow-2xl ${
        preview ? 'h-full min-h-full' : 'min-h-screen'
      }`}
    >
      <BestMixStyles />
      <OceanBackground />

      {toast ? (
        <div className="fixed left-1/2 top-7 z-[80] -translate-x-1/2 rounded-full bg-white px-5 py-2 text-xs font-black text-[#006875] shadow-lg">
          {toast}
        </div>
      ) : null}

      {isOpen && config.media.musicUrl && !preview ? (
        <button
          className="fixed bottom-24 right-[max(20px,calc((100vw-28rem)/2+20px))] z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-white/20 text-white shadow-lg backdrop-blur-xl active:scale-95"
          type="button"
          onClick={toggleAudio}
          aria-label="Toggle music"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      ) : null}

      <header className="absolute inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/30 bg-white/15 px-5 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/55">
            <img
              alt=""
              className="h-full w-full object-cover"
              src={config.media.profileImage || config.media.coverImage}
              onError={handleImageError}
            />
          </div>
          <p className="truncate text-lg font-bold text-white drop-shadow-sm">{config.subject.name.split(' ')[0]}</p>
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/14" type="button" aria-label="Music" onClick={toggleAudio}>
          <Music size={18} />
        </button>
      </header>

      <main className={`no-scrollbar relative z-10 overflow-y-auto px-6 pb-28 pt-24 ${preview ? 'h-full' : 'h-screen'}`}>
        <div className={liveAnimationClass} style={liveAnimationStyle}>
          {!isOpen ? (
            <section className="flex min-h-[calc(100vh-152px)] flex-col items-center justify-center text-center">
            <div className="best-glass mb-6 inline-flex rounded-full p-4 best-float">
              <Sparkles size={44} />
            </div>
            <p className="mb-3 rounded-full bg-[#f5cd00] px-4 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#221b00]">
              Kepada {guestName}
            </p>
            <h1 className="mb-6 text-4xl font-black leading-tight drop-shadow-lg">{config.title}</h1>
            <div className="best-glass mb-8 rounded-[28px] p-7">
              <p className="text-lg italic leading-8 text-white/92">"Maka nikmat Tuhanmu yang manakah yang kamu dustakan?"</p>
              <div className="mx-auto my-5 h-px w-28 bg-white/30" />
              <p className="text-sm leading-7 text-white/86">{config.subtitle}</p>
            </div>
            <button className="best-primary-button" type="button" onClick={openInvitation}>
              Buka Undangan
              <Navigation size={17} />
            </button>
            </section>
          ) : null}

          {isOpen && activeSection === 'cover' ? (
            <section className="space-y-5 text-center">
            <h1 className="text-4xl font-black leading-tight">{config.title}</h1>
            <div className="best-glass overflow-hidden rounded-[30px] p-2">
              <img
                alt=""
                className="aspect-[4/3] w-full rounded-[24px] object-cover"
                src={config.media.coverImage}
                onError={handleImageError}
              />
            </div>
            <p className="text-sm leading-7 text-white/82">{config.subtitle}</p>
            </section>
          ) : null}

          {isOpen && activeSection === 'profile' ? (
            <section className="flex flex-col items-center gap-6 text-center">
            <div className="relative mt-3">
              <div className="absolute inset-0 rounded-full bg-[#00e5ff]/45 blur-3xl" />
              <div className="relative h-52 w-52 overflow-hidden rounded-full bg-gradient-to-br from-[#00e5ff] via-white/85 to-[#f5cd00] p-2 shadow-[0_24px_60px_rgba(0,89,187,.32)]">
                <img
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                  src={config.media.profileImage}
                  onError={handleImageError}
                />
              </div>
              <div className="absolute -right-2 top-2 rounded-full bg-[#f5cd00] p-3 text-[#221b00] shadow-lg best-float">
                <Waves size={20} />
              </div>
              <div className="absolute -bottom-1 -left-2 rounded-full bg-[#0059bb] p-3 text-white shadow-lg">
                <Heart size={19} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black leading-tight text-white drop-shadow-md">{config.subject.name}</h2>
              <p className="mt-3 inline-flex rounded-full border border-white/35 bg-white/20 px-4 py-2 text-sm font-semibold text-white/86 backdrop-blur">
                {config.subject.description}
              </p>
            </div>
            <div className="best-glass rounded-[28px] p-6 text-left">
              <Star className="mb-3 text-[#f5cd00]" size={24} />
              <p className="text-base italic leading-8 text-white/86">
                Semoga menjadi anak yang sholeh, berbakti kepada orang tua, cerdas, dan senantiasa dalam lindungan Allah SWT.
              </p>
            </div>
            </section>
          ) : null}

          {isOpen && activeSection === 'event' ? (
            <section className="space-y-5">
            <div className="text-center">
              <p className="mb-2 inline-flex rounded-full bg-[#f5cd00] px-4 py-1 text-xs font-bold text-[#221b00]">
                {config.eventType.toUpperCase()}
              </p>
              <h2 className="text-4xl font-black">Acara</h2>
              <p className="mt-2 text-white/82">Jadwal kebahagiaan kami</p>
            </div>
            <CountdownGrid schedule={config.schedule} />
            <div className="best-glass rounded-[28px] p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-white/20 p-3">
                  <Clock size={30} />
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#9cf0ff]">{config.schedule.time}</p>
                  <p className="text-xs text-white/70">{formatTimeZone(config.schedule.timezone)}</p>
                </div>
              </div>
              <h3 className="text-2xl font-black">{config.schedule.displayDate}</h3>
              <p className="mt-2 text-sm leading-6 text-white/80">{getEventTitle(config)}</p>
            </div>
            <div className="best-glass overflow-hidden rounded-[28px]">
              <iframe
                title="Lokasi Google Maps"
                src={config.location.mapsEmbedUrl}
                className="h-44 w-full border-0"
                loading="lazy"
              />
              <div className="p-5">
                <div className="flex gap-3">
                  <MapPin className="shrink-0 text-[#9cf0ff]" />
                  <div>
                    <h4 className="font-black">{config.location.name}</h4>
                    <p className="mt-1 text-sm leading-6 text-white/78">{config.location.address}</p>
                  </div>
                </div>
                <a className="best-primary-button mt-5" href={config.location.mapsLink} target="_blank" rel="noopener noreferrer">
                  Buka Maps
                  <Navigation size={17} />
                </a>
              </div>
            </div>
            </section>
          ) : null}

          {isOpen && activeSection === 'wishes' ? (
            <section className="space-y-6">
            {config.sections?.gallery ? (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="text-[#f5cd00]" />
                  <h2 className="text-3xl font-black">Album Galeri</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="best-glass col-span-2 aspect-video overflow-hidden rounded-[24px] p-2">
                    <img
                      alt=""
                      className="h-full w-full rounded-2xl object-cover"
                      src={gallery[0] || config.media.coverImage}
                      onError={handleImageError}
                    />
                  </div>
                  {gallery.slice(1, 3).map((src) => (
                    <div key={src} className="best-glass aspect-square overflow-hidden rounded-[22px] p-2">
                      <img alt="" className="h-full w-full rounded-2xl object-cover" src={src} onError={handleImageError} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {config.sections?.wishes && config.wishes?.enabled ? (
              <form className="best-glass rounded-[30px] p-7" onSubmit={submitWish}>
                <div className="mb-5 text-center">
                  <h3 className="text-2xl font-black">Kirim Ucapan</h3>
                  <p className="mt-1 text-sm text-white/76">Berikan restu dan doa terbaik</p>
                </div>
                <div className="space-y-4">
                  <input className="best-input" placeholder="Nama lengkap" value={formName} onChange={(event) => setFormName(event.target.value)} />
                  <textarea className="best-input min-h-28 resize-none" placeholder="Tuliskan ucapan..." value={formMessage} onChange={(event) => setFormMessage(event.target.value)} />
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ['Hadir', CheckCircle2],
                      ['Tentatif', HelpCircle],
                      ['Absen', XCircle],
                    ].map(([label, Icon]) => (
                      <button
                        key={label}
                        className={`best-status-button ${formStatus === label ? 'best-status-button-active' : ''}`}
                        type="button"
                        onClick={() => setFormStatus(label)}
                      >
                        <Icon size={20} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  <button className="best-primary-button" type="submit">
                    Kirim Sekarang
                    <Send size={17} />
                  </button>
                </div>
              </form>
            ) : null}

            {config.sections?.wishes && config.wishes?.enabled ? (
              <div className="best-glass rounded-[26px] p-5">
                <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9cf0ff]">
                    Do'a Tamu ({wishes.length})
                  </p>
                  <p className="text-[10px] font-bold text-white/50">Scroll</p>
                </div>
                <div className="no-scrollbar max-h-44 space-y-3 overflow-y-auto pr-1">
                  {wishes.map((wish, index) => (
                    <div key={`${wish.name}-${index}`} className="rounded-2xl border border-white/15 bg-white/10 p-3">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-black text-white">{wish.name}</p>
                        <span className="rounded-full bg-[#f5cd00] px-2 py-0.5 text-[9px] font-black text-[#221b00]">
                          {wish.status}
                        </span>
                      </div>
                      <p className="text-xs leading-5 text-white/72">{wish.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            </section>
          ) : null}

          {isOpen && activeSection === 'thanks' ? (
            <section className="space-y-6">
            {config.sections?.closing ? (
              <div className="best-glass relative overflow-hidden rounded-[30px] p-8 text-center">
                <Star className="absolute -right-3 -top-3 h-20 w-20 text-[#f5cd00]/20 best-float" />
                <Heart className="mx-auto mb-4 fill-[#00e5ff]/10 text-[#f5cd00]" size={34} />
                <h2 className="text-3xl font-black text-white drop-shadow-md">Terima Kasih</h2>
                <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#00e5ff]" />
                <p className="text-sm leading-7 text-white/82">
                  Merupakan kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir.
                </p>
                <p className="mt-6 text-sm font-bold italic text-[#9cf0ff]">Kami yang mengundang</p>
                <p className="mt-1 text-base font-black text-white">{config.host.names.join(' & ')}</p>
              </div>
            ) : null}

            {config.sections?.gift && config.gift?.enabled ? (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <Gift className="text-[#f5cd00]" />
                  <h3 className="text-2xl font-black text-white">Kirim Kado</h3>
                </div>
                <div className="space-y-4">
                  {config.gift.accounts.map((account, index) => (
                    <div key={account.number} className="best-glass rounded-[24px] border-l-4 border-l-[#00e5ff] p-5">
                      <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-black text-[#9cf0ff]">
                        {account.bank}
                      </span>
                      <p className="mt-4 text-xl font-black tracking-wide text-white">{account.number}</p>
                      <p className="mt-1 text-xs font-semibold text-white/70">a.n. {account.name}</p>
                      <button
                        className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black shadow-md transition active:scale-95 ${
                          index % 2 === 0 ? 'bg-[#00e5ff] text-[#001f24]' : 'bg-[#f5cd00] text-[#221b00]'
                        }`}
                        type="button"
                        onClick={() => copyAccount(account)}
                      >
                        {copiedAccount === account.number ? <Check size={16} /> : <Copy size={16} />}
                        {copiedAccount === account.number ? 'Tersalin' : 'Salin Rekening'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            </section>
          ) : null}
        </div>
      </main>

      {isOpen ? (
        <nav
          className={`best-bottom-nav bottom-0 left-0 right-0 z-40 mx-auto flex max-w-md items-center justify-around rounded-t-[24px] px-3 py-3 backdrop-blur-2xl ${
            preview ? 'absolute' : 'fixed'
          }`}
        >
          {activeNav.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                className="best-nav-item flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition hover:bg-white/10 active:scale-95"
                type="button"
                onClick={() => setActiveSection(item.id)}
              >
                <span className={active ? 'best-nav-icon-active rounded-2xl p-2.5' : 'p-2.5'}>
                  <Icon size={17} />
                </span>
                <span className={active ? 'text-white' : ''}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
