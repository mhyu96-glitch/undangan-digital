import { useMemo, useState } from 'react';
import {
  Baby,
  Calendar,
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
  Waves,
  XCircle,
} from 'lucide-react';
import defaultInvitationConfig from '../config/defaultInvitationConfig.js';

const templates = [
  {
    id: 'best',
    name: 'Best Mix',
    shortName: 'Best',
    tone: 'Gabungan terbaik semua section',
    score: '9.5',
  },
  {
    id: 'cover',
    name: 'Cover Ocean',
    shortName: 'Cover',
    tone: 'Opening paling kuat',
    score: '9.0',
  },
  {
    id: 'profile',
    name: 'Profile Glow',
    shortName: 'Profile',
    tone: 'Foto bayi paling manis',
    score: '8.7',
  },
  {
    id: 'event',
    name: 'Event Glass',
    shortName: 'Acara',
    tone: 'Jadwal paling jelas',
    score: '8.8',
  },
  {
    id: 'wishes',
    name: 'Gallery Bento',
    shortName: 'Ucapan',
    tone: 'Galeri dan form terbaik',
    score: '9.2',
  },
  {
    id: 'thanks',
    name: 'Thanks Gift',
    shortName: 'Thanks',
    tone: 'Amplop paling rapi',
    score: '8.6',
  },
];

const navItems = [
  { id: 'cover', label: 'Cover', icon: Sparkles },
  { id: 'profile', label: 'Profil', icon: Baby },
  { id: 'event', label: 'Acara', icon: Calendar },
  { id: 'wishes', label: 'Ucapan', icon: Send },
  { id: 'thanks', label: 'Thanks', icon: Heart },
];

const formatTimeZone = (timezone) => {
  if (timezone?.includes('Makassar')) return 'WITA';
  if (timezone?.includes('Jakarta')) return 'WIB';
  return timezone || '';
};

function TemplateBackground({ variant = 'deep' }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 ${
          variant === 'light'
            ? 'bg-gradient-to-b from-[#9cf0ff] via-[#f5fafc] to-[#d8e2ff]'
            : 'bg-gradient-to-br from-[#00daf3] via-[#0070ea] to-[#006875]'
        }`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.76),transparent_42%)] opacity-70" />
      <div className="absolute left-[12%] top-[16%] h-5 w-5 rounded-full bg-white/35 blur-[1px] template-bubble" />
      <div className="absolute left-[72%] top-[64%] h-7 w-7 rounded-full bg-white/24 blur-[1px] template-bubble [animation-delay:1.7s]" />
      <div className="absolute left-[42%] top-[80%] h-3 w-3 rounded-full bg-white/38 template-bubble [animation-delay:3.1s]" />
      <Waves className="absolute -bottom-3 left-6 h-16 w-16 text-white/20 template-float" />
      <Waves className="absolute -bottom-5 right-8 h-20 w-20 text-white/18 template-float [animation-delay:1.5s]" />
    </div>
  );
}

function TemplateShell({ activeId, children, config, onTabChange = () => {}, variant = 'deep' }) {
  return (
    <div className="template-phone relative mx-auto h-[760px] w-full max-w-[390px] overflow-hidden rounded-[30px] bg-slate-950 text-[#171c1e] shadow-2xl">
      <TemplateBackground variant={variant} />
      <header className="absolute inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/30 bg-white/15 px-5 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/55">
            <img
              alt=""
              className="h-full w-full object-cover"
              src={config.media.profileImage || config.media.coverImage}
            />
          </div>
          <p className="truncate text-lg font-bold text-white drop-shadow-sm">{config.subject.name.split(' ')[0]}</p>
        </div>
        <button className="template-icon-button" type="button" aria-label="Music">
          <Music size={18} />
        </button>
      </header>
      <main className="no-scrollbar relative z-10 h-full overflow-y-auto px-6 pb-28 pt-24">{children}</main>
      <nav className="template-bottom-nav absolute inset-x-0 bottom-0 z-30 flex items-center justify-around rounded-t-[24px] px-3 py-3 backdrop-blur-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeId === item.id;

          return (
            <button
              key={item.id}
              className={`template-nav-item flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition active:scale-95 ${
                active ? 'template-nav-item-active' : 'hover:bg-white/10'
              }`}
              type="button"
              onClick={() => onTabChange(item.id)}
            >
              <span className={active ? 'template-nav-icon-active rounded-2xl p-2.5' : 'p-2.5'}>
                <Icon size={17} />
              </span>
              <span className={active ? 'template-nav-label-active' : ''}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function CoverTemplate({ config }) {
  return (
    <TemplateShell activeId="cover" config={config}>
      <section className="flex min-h-[580px] flex-col items-center justify-center text-center text-white">
        <div className="template-glass mb-6 inline-flex rounded-full p-4 template-float">
          <Sparkles size={44} />
        </div>
        <p className="mb-3 rounded-full bg-[#f5cd00] px-4 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#221b00]">
          Aqiqah & Tasyakuran
        </p>
        <h1 className="mb-6 text-4xl font-black leading-tight drop-shadow-lg">{config.title}</h1>
        <div className="template-glass mb-8 rounded-[28px] p-7">
          <p className="text-lg italic leading-8 text-white/92">
            "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?"
          </p>
          <div className="mx-auto my-5 h-px w-28 bg-white/30" />
          <p className="text-sm leading-7 text-white/86">{config.subtitle}</p>
        </div>
        <button className="template-primary-button" type="button">
          Buka Undangan
          <Navigation size={17} />
        </button>
      </section>
    </TemplateShell>
  );
}

function ProfileTemplate({ config }) {
  return (
    <TemplateShell activeId="profile" config={config}>
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="relative mt-3">
          <div className="absolute inset-0 rounded-full bg-[#00e5ff]/45 blur-3xl" />
          <div className="relative h-52 w-52 overflow-hidden rounded-full bg-gradient-to-br from-[#00e5ff] via-white/85 to-[#f5cd00] p-2 shadow-[0_24px_60px_rgba(0,89,187,.32)]">
            <img alt="" className="h-full w-full rounded-full object-cover" src={config.media.profileImage} />
          </div>
          <div className="absolute -right-2 top-2 rounded-full bg-[#f5cd00] p-3 text-[#221b00] shadow-lg template-float">
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
        <div className="template-glass rounded-[28px] p-6 text-left">
          <Star className="mb-3 text-[#f5cd00]" size={24} />
          <p className="text-base italic leading-8 text-white/86">
            Semoga menjadi anak yang sholeh, berbakti kepada orang tua, cerdas, dan senantiasa dalam lindungan Allah SWT.
          </p>
        </div>
        <button className="template-primary-button" type="button">
          <Send size={18} />
          Kirim Ucapan
        </button>
      </section>
    </TemplateShell>
  );
}

function EventTemplate({ config }) {
  return (
    <TemplateShell activeId="event" config={config}>
      <section className="space-y-5 text-white">
        <div className="text-center">
          <p className="mb-2 inline-flex rounded-full bg-[#f5cd00] px-4 py-1 text-xs font-bold text-[#221b00]">
            {config.eventType.toUpperCase()}
          </p>
          <h2 className="text-4xl font-black">Acara</h2>
          <p className="mt-2 text-white/82">Jadwal kebahagiaan kami</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            ['12', 'Hari'],
            ['08', 'Jam'],
            ['24', 'Menit'],
            ['16', 'Detik'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="template-glass flex h-16 items-center justify-center rounded-full">
                <span className="text-2xl font-black">{value}</span>
              </div>
              <p className="mt-2 text-[10px] font-bold uppercase text-white/75">{label}</p>
            </div>
          ))}
        </div>
        <div className="template-glass rounded-[28px] p-6">
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
          <p className="mt-2 text-sm leading-6 text-white/80">{config.title}</p>
        </div>
        <div className="template-glass overflow-hidden rounded-[28px]">
          <div className="h-40 bg-[radial-gradient(circle_at_35%_40%,rgba(245,205,0,.7),transparent_14%),linear-gradient(135deg,rgba(156,240,255,.8),rgba(0,89,187,.8))]" />
          <div className="p-5">
            <div className="flex gap-3">
              <MapPin className="shrink-0 text-[#9cf0ff]" />
              <div>
                <h4 className="font-black">{config.location.name}</h4>
                <p className="mt-1 text-sm leading-6 text-white/78">{config.location.address}</p>
              </div>
            </div>
            <button className="template-primary-button mt-5" type="button">
              Buka Maps
              <Navigation size={17} />
            </button>
          </div>
        </div>
      </section>
    </TemplateShell>
  );
}

function WishesTemplate({ config }) {
  const gallery = useMemo(() => config.media.gallery.slice(0, 4), [config.media.gallery]);

  return (
    <TemplateShell activeId="wishes" config={config}>
      <section className="space-y-6 text-white">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="text-[#f5cd00]" />
            <h2 className="text-3xl font-black">Album Galeri</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="template-glass col-span-2 aspect-video overflow-hidden rounded-[24px] p-2 transition hover:scale-[1.02]">
              <img alt="" className="h-full w-full rounded-2xl object-cover" src={gallery[0]} />
            </div>
            {gallery.slice(1, 3).map((src) => (
              <div key={src} className="template-glass aspect-square overflow-hidden rounded-[22px] p-2">
                <img alt="" className="h-full w-full rounded-2xl object-cover" src={src} />
              </div>
            ))}
          </div>
        </div>
        <div className="template-glass rounded-[30px] p-7">
          <div className="mb-5 text-center">
            <h3 className="text-2xl font-black">Kirim Ucapan</h3>
            <p className="mt-1 text-sm text-white/76">Berikan restu dan doa terbaik</p>
          </div>
          <div className="space-y-4">
            <input className="template-input" placeholder="Nama lengkap" />
            <textarea className="template-input min-h-28 resize-none" placeholder="Tuliskan ucapan..." />
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Hadir', CheckCircle2],
                ['Tentatif', HelpCircle],
                ['Absen', XCircle],
              ].map(([label, Icon]) => (
                <button key={label} className="template-status-button" type="button">
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <button className="template-primary-button" type="button">
              Kirim Sekarang
              <Send size={17} />
            </button>
          </div>
        </div>
      </section>
    </TemplateShell>
  );
}

function ThanksTemplate({ config }) {
  return (
    <TemplateShell activeId="thanks" config={config}>
      <section className="space-y-6 text-white">
        <div className="template-glass relative overflow-hidden rounded-[30px] p-8 text-center">
          <Star className="absolute -right-3 -top-3 h-20 w-20 text-[#f5cd00]/20 template-float" />
          <Heart className="mx-auto mb-4 fill-[#00e5ff]/10 text-[#f5cd00]" size={34} />
          <h2 className="text-3xl font-black text-white drop-shadow-md">Terima Kasih</h2>
          <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#00e5ff]" />
          <p className="text-sm leading-7 text-white/82">
            Merupakan kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
          <p className="mt-6 text-sm font-bold italic text-[#9cf0ff]">Kami yang mengundang</p>
          <p className="mt-1 text-base font-black text-white">{config.host.names.join(' & ')}</p>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Gift className="text-[#f5cd00]" />
            <h3 className="text-2xl font-black text-white">Kirim Kado</h3>
          </div>
          <div className="space-y-4">
            {config.gift.accounts.map((account, index) => (
              <div key={account.number} className="template-glass rounded-[24px] border-l-4 border-l-[#00e5ff] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-black text-[#9cf0ff]">
                    {account.bank}
                  </span>
                  <Gift className="text-[#f5cd00]" size={18} />
                </div>
                <p className="text-xl font-black tracking-wide text-white">{account.number}</p>
                <p className="mt-1 text-xs font-semibold text-white/70">a.n. {account.name}</p>
                <button
                  className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black shadow-md transition active:scale-95 ${
                    index % 2 === 0 ? 'bg-[#00e5ff] text-[#001f24]' : 'bg-[#f5cd00] text-[#221b00]'
                  }`}
                  type="button"
                >
                  <Copy size={16} />
                  Salin Rekening
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </TemplateShell>
  );
}

function BestMixTemplate({ config }) {
  const [activeSection, setActiveSection] = useState('cover');
  const gallery = useMemo(() => config.media.gallery.slice(0, 4), [config.media.gallery]);
  return (
    <TemplateShell
      activeId={activeSection}
      config={config}
      onTabChange={setActiveSection}
    >
      {activeSection === 'cover' ? (
        <section className="flex min-h-[580px] flex-col items-center justify-center text-center text-white">
          <div className="template-glass mb-6 inline-flex rounded-full p-4 template-float">
            <Sparkles size={44} />
          </div>
          <p className="mb-3 rounded-full bg-[#f5cd00] px-4 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#221b00]">
            Aqiqah & Tasyakuran
          </p>
          <h1 className="mb-6 text-4xl font-black leading-tight drop-shadow-lg">{config.title}</h1>
          <div className="template-glass mb-8 rounded-[28px] p-7">
            <p className="text-lg italic leading-8 text-white/92">
              "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?"
            </p>
            <div className="mx-auto my-5 h-px w-28 bg-white/30" />
            <p className="text-sm leading-7 text-white/86">{config.subtitle}</p>
          </div>
          <button className="template-primary-button" type="button" onClick={() => setActiveSection('profile')}>
            Buka Undangan
            <Navigation size={17} />
          </button>
        </section>
      ) : null}

      {activeSection === 'profile' ? (
        <section className="flex flex-col items-center gap-6 text-center">
          <div className="relative mt-3">
            <div className="absolute inset-0 rounded-full bg-[#00e5ff]/45 blur-3xl" />
            <div className="relative h-52 w-52 overflow-hidden rounded-full bg-gradient-to-br from-[#00e5ff] via-white/85 to-[#f5cd00] p-2 shadow-[0_24px_60px_rgba(0,89,187,.32)]">
              <img alt="" className="h-full w-full rounded-full object-cover" src={config.media.profileImage} />
            </div>
            <div className="absolute -right-2 top-2 rounded-full bg-[#f5cd00] p-3 text-[#221b00] shadow-lg template-float">
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
          <div className="template-glass rounded-[28px] p-6 text-left">
            <Star className="mb-3 text-[#f5cd00]" size={24} />
            <p className="text-base italic leading-8 text-white/86">
              Semoga menjadi anak yang sholeh, berbakti kepada orang tua, cerdas, dan senantiasa dalam lindungan Allah SWT.
            </p>
          </div>
          <button className="template-primary-button" type="button" onClick={() => setActiveSection('event')}>
            Lihat Acara
            <Calendar size={18} />
          </button>
        </section>
      ) : null}

      {activeSection === 'event' ? (
        <section className="space-y-5 text-white">
          <div className="text-center">
            <p className="mb-2 inline-flex rounded-full bg-[#f5cd00] px-4 py-1 text-xs font-bold text-[#221b00]">
              {config.eventType.toUpperCase()}
            </p>
            <h2 className="text-4xl font-black">Acara</h2>
            <p className="mt-2 text-white/82">Jadwal kebahagiaan kami</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              ['12', 'Hari'],
              ['08', 'Jam'],
              ['24', 'Menit'],
              ['16', 'Detik'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <div className="template-glass flex h-16 items-center justify-center rounded-full">
                  <span className="text-2xl font-black">{value}</span>
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase text-white/75">{label}</p>
              </div>
            ))}
          </div>
          <div className="template-glass rounded-[28px] p-6">
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
            <p className="mt-2 text-sm leading-6 text-white/80">{config.location.name}</p>
          </div>
          <button className="template-primary-button" type="button" onClick={() => setActiveSection('wishes')}>
            Lihat Galeri
            <Sparkles size={17} />
          </button>
        </section>
      ) : null}

      {activeSection === 'wishes' ? (
        <section className="space-y-6 text-white">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="text-[#f5cd00]" />
              <h2 className="text-3xl font-black">Album Galeri</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="template-glass col-span-2 aspect-video overflow-hidden rounded-[24px] p-2 transition hover:scale-[1.02]">
                <img alt="" className="h-full w-full rounded-2xl object-cover" src={gallery[0]} />
              </div>
              {gallery.slice(1, 3).map((src) => (
                <div key={src} className="template-glass aspect-square overflow-hidden rounded-[22px] p-2">
                  <img alt="" className="h-full w-full rounded-2xl object-cover" src={src} />
                </div>
              ))}
            </div>
          </div>
          <div className="template-glass rounded-[30px] p-7">
            <div className="mb-5 text-center">
              <h3 className="text-2xl font-black">Kirim Ucapan</h3>
              <p className="mt-1 text-sm text-white/76">Berikan restu dan doa terbaik</p>
            </div>
            <div className="space-y-4">
              <input className="template-input" placeholder="Nama lengkap" />
              <textarea className="template-input min-h-28 resize-none" placeholder="Tuliskan ucapan..." />
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Hadir', CheckCircle2],
                  ['Tentatif', HelpCircle],
                  ['Absen', XCircle],
                ].map(([label, Icon]) => (
                  <button key={label} className="template-status-button" type="button">
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <button className="template-primary-button" type="button" onClick={() => setActiveSection('thanks')}>
                Lanjut Thanks
                <Send size={17} />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeSection === 'thanks' ? (
        <section className="space-y-6 text-white">
          <div className="template-glass relative overflow-hidden rounded-[30px] p-8 text-center">
            <Star className="absolute -right-3 -top-3 h-20 w-20 text-[#f5cd00]/20 template-float" />
            <Heart className="mx-auto mb-4 fill-[#00e5ff]/10 text-[#f5cd00]" size={34} />
            <h2 className="text-3xl font-black text-white drop-shadow-md">Terima Kasih</h2>
            <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#00e5ff]" />
            <p className="text-sm leading-7 text-white/82">
              Merupakan kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir.
            </p>
          </div>
          <div className="space-y-4">
            {config.gift.accounts.map((account, index) => (
              <div key={account.number} className="template-glass rounded-[24px] border-l-4 border-l-[#00e5ff] p-5">
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
                >
                  <Copy size={16} />
                  Salin Rekening
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </TemplateShell>
  );
}

function TemplatePreview({ templateId, config }) {
  if (templateId === 'best') return <BestMixTemplate config={config} />;
  if (templateId === 'profile') return <ProfileTemplate config={config} />;
  if (templateId === 'event') return <EventTemplate config={config} />;
  if (templateId === 'wishes') return <WishesTemplate config={config} />;
  if (templateId === 'thanks') return <ThanksTemplate config={config} />;
  return <CoverTemplate config={config} />;
}

export default function TemplateShowcase() {
  const [activeTemplate, setActiveTemplate] = useState('best');
  const active = templates.find((template) => template.id === activeTemplate) || templates[0];

  return (
    <main className="min-h-screen bg-[#f5fafc] text-[#171c1e]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes templateFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes templateBubble {
          0% { transform: translateY(0) scale(.8); opacity: .2; }
          45% { opacity: .55; }
          100% { transform: translateY(-160px) scale(1.1); opacity: 0; }
        }

        .template-float { animation: templateFloat 6s ease-in-out infinite; }
        .template-bubble { animation: templateBubble 9s linear infinite; }

        .template-glass {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.32);
          box-shadow: 0 18px 46px rgba(0, 89, 187, 0.16);
        }

        .template-primary-button {
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

        .template-primary-button:active,
        .template-secondary-button:active,
        .template-status-button:active {
          transform: scale(.95);
        }

        .template-secondary-button {
          min-height: 52px;
          display: inline-flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 18px;
          background: #0059bb;
          color: white;
          font-weight: 900;
          box-shadow: 0 12px 26px rgba(0, 89, 187, .25);
          transition: transform 180ms ease;
        }

        .template-icon-button {
          min-height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          color: white;
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.28);
        }

        .template-input {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.3);
          background: rgba(255,255,255,.12);
          padding: 14px 18px;
          color: white;
          outline: none;
        }

        .template-input::placeholder { color: rgba(255,255,255,.55); }

      .template-status-button {
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

        .template-bottom-nav {
          background: linear-gradient(135deg, rgba(0, 112, 234, 0.9), rgba(0, 104, 117, 0.94));
          border-top: 1px solid rgba(156, 240, 255, 0.45);
          box-shadow: 0 -14px 34px rgba(0, 31, 36, 0.26);
        }

        .template-nav-item {
          color: rgba(255, 255, 255, 0.72);
        }

        .template-nav-item span {
          color: rgba(255, 255, 255, 0.76);
        }

        .template-nav-item-active {
          color: white;
        }

        .template-nav-icon-active {
          background: linear-gradient(135deg, #f5cd00, #00e5ff);
          color: #001f24 !important;
          box-shadow: 0 8px 20px rgba(0, 229, 255, 0.28);
        }

        .template-nav-label-active {
          color: white;
          text-shadow: 0 1px 8px rgba(0, 31, 36, 0.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .template-float,
          .template-bubble {
            animation: none !important;
          }
        }
      ` }} />

      <section className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[330px_minmax(0,1fr)] lg:px-6">
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#006875]">Template Compare</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Pilih arah visual</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Semua opsi diambil dari kode yang kamu kirim, lalu disesuaikan ke React dan data undangan kita.
            </p>
            <div className="mt-5 grid gap-2">
              {templates.map((template) => {
                const activeItem = activeTemplate === template.id;

                return (
                  <button
                    key={template.id}
                    className={`border px-4 py-3 text-left transition active:scale-[0.99] ${
                      activeItem
                        ? 'border-[#006875] bg-[#e0f7fa] text-[#001f24]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    type="button"
                    onClick={() => setActiveTemplate(template.id)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-black">{template.name}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-black text-[#0059bb]">
                        {template.score}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">{template.tone}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 border-t border-slate-200 pt-4">
              <p className="text-sm font-black text-slate-900">Rekomendasi saya</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Pakai struktur Gallery Bento untuk form dan button, Event Glass untuk jadwal, lalu Cover Ocean untuk opening.
              </p>
            </div>
          </div>
        </aside>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Preview aktif</p>
                <h2 className="mt-1 text-2xl font-black">{active.name}</h2>
              </div>
              <a className="text-sm font-black text-[#006875] hover:text-[#001f24]" href="/">
                Kembali ke undangan
              </a>
            </div>
            <TemplatePreview templateId={activeTemplate} config={defaultInvitationConfig} />
          </div>

          <div className="grid gap-3 self-start">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`grid grid-cols-[86px_minmax(0,1fr)] gap-3 border bg-white p-3 text-left shadow-sm transition hover:border-[#006875] active:scale-[0.99] ${
                  activeTemplate === template.id ? 'border-[#006875]' : 'border-slate-200'
                }`}
                type="button"
                onClick={() => setActiveTemplate(template.id)}
              >
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#00daf3] via-[#0070ea] to-[#006875]">
                  <div className="absolute inset-2 rounded-xl border border-white/40 bg-white/20 backdrop-blur" />
                  <div className="absolute bottom-2 left-2 right-2 h-5 rounded-full bg-white/70" />
                </div>
                <div className="min-w-0 py-1">
                  <p className="font-black">{template.shortName}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{template.tone}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#0059bb]">
                    Score {template.score}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
