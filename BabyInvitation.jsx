import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Calendar, MessageSquare, Heart, Volume2, VolumeX, 
  MapPin, Send, Copy, Check, Gift, Clock, ExternalLink, 
  ChevronRight, Sparkles, Users 
} from 'lucide-react';
import defaultInvitationConfig from './src/config/defaultInvitationConfig.js';
import { getInvitationTheme } from './src/config/themes.js';
import { loadBuilderDraft } from './src/services/configStorage.js';
import { getGuestNameFromUrl } from './src/services/guestName.js';
import { getSoundCloudEmbedUrl, isDirectAudioUrl, isSoundCloudUrl } from './src/services/mediaUrl.js';

// === CONFIGURATION & DATA CONSTANTS ===
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

const getActiveInvitationConfig = () => {
  if (typeof window === 'undefined') return cloneConfig(defaultInvitationConfig);
  return mergeConfig(defaultInvitationConfig, loadBuilderDraft());
};

const getHostLine = (config) => (config.host?.names || []).filter(Boolean).join(' & ');

const getEventTitle = (config) => config.title?.replace(/^Undangan\s+/i, '') || config.title;

const getCountdownTarget = (schedule) => {
  const date = schedule?.date || defaultInvitationConfig.schedule.date;
  const time = schedule?.time || defaultInvitationConfig.schedule.time;
  return new Date(`${date}T${time}:00`).getTime();
};

const getGalleryPhotos = (config) => {
  const subjectFirstName = config.subject?.name?.split(' ')[0] || 'Foto';
  const gallery = config.media?.gallery?.length
    ? config.media.gallery
    : [config.media?.coverImage, config.media?.profileImage].filter(Boolean);

  return gallery.map((src, index) => ({
    src,
    caption: `${subjectFirstName} - Foto ${index + 1}`,
  }));
};

// === CUSTOM STYLES COMPONENT ===
const MarineStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');
    
    .font-serif-elegant { font-family: 'Playfair Display', serif; }
    .font-cinzel { font-family: 'Cinzel Decorative', serif; }
    .font-sans-clean { font-family: 'Plus Jakarta Sans', sans-serif; }

    /* Gentle underwater animations */
    @keyframes underwater-float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    @keyframes underwater-float-delayed {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(6px) rotate(-0.8deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    @keyframes seaweed-sway-left {
      0%, 100% { transform: rotate(0deg) scaleX(1); }
      50% { transform: rotate(3deg) scaleX(1.01); }
    }

    @keyframes seaweed-sway-right {
      0%, 100% { transform: rotate(0deg) scaleX(-1); }
      50% { transform: rotate(-3deg) scaleX(-1.01); }
    }

    @keyframes sun-ray-pulse {
      0%, 100% { opacity: 0.45; transform: scale(1); }
      50% { opacity: 0.65; transform: scale(1.04); }
    }

    @keyframes swim-right-animation {
      0% { transform: translateX(-150px) scaleX(1); opacity: 0; }
      10% { opacity: 0.9; }
      90% { opacity: 0.9; }
      100% { transform: translateX(500px) scaleX(1); opacity: 0; }
    }

    @keyframes swim-left-animation {
      0% { transform: translateX(500px) scaleX(-1); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateX(-150px) scaleX(-1); opacity: 0; }
    }

    @keyframes bubble-rise-animation {
      0% { transform: translateY(105vh) translateX(0) scale(0.6); opacity: 0; }
      15% { opacity: 0.9; }
      85% { opacity: 0.9; }
      100% { transform: translateY(-10vh) translateX(15px) scale(1.1); opacity: 0; }
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.98); opacity: 0.5; }
      50% { transform: scale(1.03); opacity: 0.8; }
      100% { transform: scale(0.98); opacity: 0.5; }
    }

    /* Animation classes */
    .animate-underwater-float { animation: underwater-float 14s ease-in-out infinite; }
    .animate-underwater-float-delayed { animation: underwater-float-delayed 16s ease-in-out infinite; }
    .animate-seaweed-left { animation: seaweed-sway-left 14s ease-in-out infinite; transform-origin: bottom center; }
    .animate-seaweed-right { animation: seaweed-sway-right 16s ease-in-out infinite; transform-origin: bottom center; }
    .animate-sun-rays { animation: sun-ray-pulse 18s ease-in-out infinite; }
    .animate-swim-right-slow { animation: swim-right-animation 42s linear infinite; }
    .animate-swim-left-slow { animation: swim-left-animation 46s linear infinite; }
    .animate-swim-right-fast { animation: swim-right-animation 32s linear infinite; }
    .animate-bubble-rise-slow { animation: bubble-rise-animation 24s linear infinite; }
    .animate-bubble-rise-fast { animation: bubble-rise-animation 16s linear infinite; }
    .animate-ring-pulse { animation: pulse-ring 3.5s ease-in-out infinite; }

    /* Custom scrollbar */
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { 
      background: rgba(255, 255, 255, 0.15); 
      border-radius: 99px; 
    }
    .custom-scrollbar::-webkit-scrollbar-thumb { 
      background: rgba(0, 180, 216, 0.5); 
      border-radius: 99px; 
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
      background: rgba(0, 180, 216, 0.8); 
    }
  ` }} />
);

const InvitationThemeStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .digital-invitation {
      --invitation-container-margin: 24px;
      --invitation-stack-sm: 12px;
      --invitation-stack-md: 24px;
      --invitation-stack-lg: 48px;
      --invitation-radius-card: 24px;
      --invitation-radius-control: 16px;
      background: var(--invitation-background) !important;
      color: var(--invitation-text) !important;
      box-shadow: 0 0 50px color-mix(in srgb, var(--invitation-primary) 24%, transparent) !important;
    }

    .invitation-content {
      padding: 32px var(--invitation-container-margin) 112px;
    }

    .invitation-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: var(--invitation-radius-card);
      box-shadow: 0 18px 46px color-mix(in srgb, var(--invitation-primary) 14%, transparent);
    }

    .invitation-primary-button {
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      border-radius: var(--invitation-radius-control);
      background: linear-gradient(135deg, var(--invitation-accent), var(--invitation-primary));
      color: white;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      box-shadow: 0 12px 30px color-mix(in srgb, var(--invitation-primary) 28%, transparent);
      transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
    }

    .invitation-primary-button:hover {
      filter: brightness(1.04);
      box-shadow: 0 16px 36px color-mix(in srgb, var(--invitation-primary) 34%, transparent);
    }

    .invitation-primary-button:active {
      transform: scale(0.95);
    }

    .invitation-icon-button {
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid color-mix(in srgb, var(--invitation-primary) 26%, white);
      color: var(--invitation-primary);
      box-shadow: 0 8px 22px color-mix(in srgb, var(--invitation-primary) 18%, transparent);
      transition: transform 180ms ease, background 180ms ease;
    }

    .invitation-icon-button:active {
      transform: scale(0.92);
    }

    .invitation-floating-audio {
      right: max(20px, calc((100vw - 28rem) / 2 + 20px));
    }

    .invitation-bottom-nav {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 40;
      width: 100%;
      max-width: 28rem;
      margin-inline: auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 12px 16px;
      border-radius: 20px 20px 0 0;
      background: rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-top: 1px solid rgba(255, 255, 255, 0.36);
      box-shadow: 0 -8px 32px color-mix(in srgb, var(--invitation-primary) 12%, transparent);
    }

    .invitation-nav-button {
      min-height: 52px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 12px;
      color: rgba(59, 73, 76, 0.72);
      transition: color 180ms ease, background 180ms ease, transform 180ms ease;
    }

    .invitation-nav-button:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    .invitation-nav-button:active {
      transform: scale(0.95);
    }

    .invitation-nav-button-active {
      color: var(--invitation-primary);
      font-weight: 800;
    }

    .invitation-nav-icon-active {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid color-mix(in srgb, var(--invitation-primary) 16%, white);
      box-shadow: 0 6px 18px color-mix(in srgb, var(--invitation-primary) 18%, transparent);
      transform: scale(1.08);
    }

    @media (max-width: 380px) {
      .digital-invitation {
        --invitation-container-margin: 18px;
      }

      .invitation-content {
        padding-top: 24px;
      }
    }

    .digital-invitation [class*="text-[#0077b6]"],
    .digital-invitation [class*="text-[#0089a3]"] {
      color: var(--invitation-primary) !important;
    }

    .digital-invitation [class*="text-[#003049]"],
    .digital-invitation [class*="text-[#002855]"] {
      color: var(--invitation-text) !important;
    }

    .digital-invitation [class*="bg-[#e0f7fa]"],
    .digital-invitation [class*="bg-[#e0f2fe]"],
    .digital-invitation [class*="bg-[#f0f9ff]"] {
      background-color: color-mix(in srgb, var(--invitation-background) 82%, white) !important;
    }

    .digital-invitation button[class*="from-[#00b4d8]"],
    .digital-invitation a[class*="from-[#00b4d8]"] {
      background: linear-gradient(135deg, var(--invitation-accent), var(--invitation-primary)) !important;
    }

    .digital-invitation [class*="border-cyan"],
    .digital-invitation [class*="border-sky"] {
      border-color: color-mix(in srgb, var(--invitation-primary) 28%, white) !important;
    }

    .digital-invitation [class*="via-[#0077b6]"] {
      --tw-gradient-stops: var(--tw-gradient-from), var(--invitation-primary), var(--tw-gradient-to) !important;
    }

    .digital-invitation[data-theme="elegant"] .marine-only {
      display: none !important;
    }
  ` }} />
);

// === MARINE BACKGROUND COMPONENT ===
const MarineBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Bright tropical gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#e0faff] via-[#00f2fe] to-[#0284c7]" />
    
    {/* Sunlight rays */}
    <div 
      className="absolute inset-0 pointer-events-none opacity-60 animate-sun-rays" 
      style={{ 
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.85) 0%, rgba(6, 182, 212, 0.1) 70%)' 
      }} 
    />

    {/* Floating sea turtle */}
    <div className="absolute top-[26%] left-[8%] w-24 h-24 opacity-25 animate-underwater-float">
      <svg viewBox="0 0 100 100" fill="currentColor" className="text-cyan-100">
        <path d="M50,15 C44,15 38,18 36,23 C35,25 36,28 38,30 C34,35 32,42 34,48 C31,51 28,52 26,50 C23,48 18,48 15,51 C12,54 13,60 17,63 C19,64 22,64 24,62 C26,67 30,72 35,74 C34,78 31,82 31,85 C31,89 35,92 39,90 C43,88 45,84 44,80 C48,81 52,81 56,80 C55,84 57,88 61,90 C65,92 69,89 69,85 C69,82 66,78 65,74 C70,72 74,67 76,62 C78,64 81,64 83,63 C87,60 88,54 85,51 C82,48 77,48 74,50 C76,42 74,35 70,30 C72,28 73,25 72,23 C70,18 64,15 50,15 Z M50,22 C55,22 58,24 59,27 C54,28 46,28 41,27 C42,24 45,22 50,22 Z M40,32 C45,34 55,34 60,32 C63,36 64,42 63,48 C58,47 42,47 37,48 C36,42 37,36 40,32 Z M35,53 C42,52 58,52 65,53 C64,59 62,64 50,68 C38,64 36,59 35,53 Z" />
      </svg>
    </div>

    {/* Coral reef garden */}
    <SeaweedAndCoral />
    
    {/* Swimming fish schools */}
    <SwimmingFish />
    
    {/* Rising bubbles */}
    <RisingBubbles />
  </div>
);

const ElegantBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#dbe6ef]" />
    <div
      className="absolute inset-0 opacity-45"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(51,65,85,0.08) 0 1px, transparent 1px 18px)',
      }}
    />
    <div className="absolute inset-x-8 top-12 h-px bg-gradient-to-r from-transparent via-slate-400/35 to-transparent" />
    <div className="absolute inset-x-12 bottom-20 h-px bg-gradient-to-r from-transparent via-slate-500/25 to-transparent" />
    <div className="absolute left-6 top-24 h-40 w-px bg-gradient-to-b from-transparent via-slate-500/20 to-transparent" />
    <div className="absolute right-8 bottom-28 h-44 w-px bg-gradient-to-b from-transparent via-slate-500/20 to-transparent" />
  </div>
);

const InvitationBackground = ({ themeId }) =>
  themeId === 'elegant' ? <ElegantBackground /> : <MarineBackground />;

// === SUB-COMPONENTS FOR MARINE ELEMENTS ===
const SeaweedAndCoral = () => (
  <>
    {/* Left green seaweed */}
    <div className="absolute bottom-8 -left-4 w-28 h-40 opacity-40 animate-seaweed-left">
      <svg viewBox="0 0 100 120" fill="currentColor" className="text-emerald-400">
        <path d="M20,110 C25,80 15,60 30,40 C35,30 30,10 35,5 C38,15 40,25 35,40 C45,50 50,40 60,30 C65,25 60,10 65,5 C68,15 65,30 55,45 C65,55 75,50 85,35 C90,25 85,15 90,10 C93,20 90,35 80,55 C70,70 75,90 70,110 Z" />
      </svg>
    </div>

    {/* Right cyan seaweed */}
    <div className="absolute bottom-8 -right-6 w-32 h-44 opacity-40 animate-seaweed-right">
      <svg viewBox="0 0 100 120" fill="currentColor" className="text-cyan-400">
        <path d="M20,110 C25,80 15,60 30,40 C35,30 30,10 35,5 C38,15 40,25 35,40 C45,50 50,40 60,30 C65,25 60,10 65,5 C68,15 65,30 55,45 C65,55 75,50 85,35 C90,25 85,15 90,10 C93,20 90,35 80,55 C70,70 75,90 70,110 Z" />
      </svg>
    </div>

    {/* Pink coral - left */}
    <div className="absolute bottom-4 left-6 w-20 h-20 opacity-35 animate-underwater-float-delayed">
      <svg viewBox="0 0 100 100" fill="currentColor" className="text-pink-400">
        <path d="M20,90 C30,70 40,80 50,50 C60,80 70,70 80,90 Z" />
        <circle cx="35" cy="65" r="5" fill="#f472b6" />
        <circle cx="65" cy="65" r="5" fill="#f472b6" />
        <circle cx="50" cy="45" r="6" fill="#f472b6" />
      </svg>
    </div>

    {/* Orange coral - right */}
    <div className="absolute bottom-4 right-8 w-24 h-22 opacity-35 animate-underwater-float">
      <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-400">
        <path d="M10,90 C30,60 40,75 60,40 C70,70 85,65 90,90 Z" />
        <circle cx="40" cy="55" r="6" fill="#fbbf24" />
        <circle cx="68" cy="60" r="5" fill="#fbbf24" />
      </svg>
    </div>
  </>
);

const SwimmingFish = () => (
  <>
    {/* Yellow fish school (top) */}
    <div className="absolute top-[12%] w-full h-8 overflow-hidden">
      <div className="animate-swim-right-fast flex space-x-6 opacity-75">
        {[1, 2, 3, 4].map((i) => (
          <svg key={i} className="w-6 h-4 text-yellow-400 drop-shadow-md" viewBox="0 0 24 16" fill="currentColor">
            <path d="M2,8 C6,3 14,3 18,8 C14,13 6,13 2,8 Z M18,8 L22,4 L21,8 L22,12 Z" />
          </svg>
        ))}
      </div>
    </div>

    {/* Pink fish school (middle) */}
    <div className="absolute top-[38%] w-full h-8 overflow-hidden">
      <div className="animate-swim-left-slow flex space-x-8 opacity-70">
        {[1, 2, 3].map((i) => (
          <svg key={i} className="w-5 h-3.5 text-pink-400 drop-shadow-md" viewBox="0 0 24 16" fill="currentColor">
            <path d="M2,8 C6,3 14,3 18,8 C14,13 6,13 2,8 Z M18,8 L22,4 L21,8 L22,12 L18,8 Z" />
          </svg>
        ))}
      </div>
    </div>

    {/* Cyan fish school (bottom) */}
    <div className="absolute top-[70%] w-full h-8 overflow-hidden">
      <div className="animate-swim-right-slow flex space-x-8 opacity-65">
        {[1, 2, 3, 4].map((i) => (
          <svg key={i} className="w-5 h-3.5 text-cyan-300 drop-shadow-md" viewBox="0 0 24 16" fill="currentColor">
            <path d="M2,8 C6,3 14,3 18,8 C14,13 6,13 2,8 Z M18,8 L22,4 L21,8 L22,12 Z" />
          </svg>
        ))}
      </div>
    </div>
  </>
);

const RisingBubbles = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute left-[10%] w-3 h-3 bg-white/25 rounded-full animate-bubble-rise-slow" style={{ animationDelay: '0s' }} />
    <div className="absolute left-[45%] w-2 h-2 bg-white/30 rounded-full animate-bubble-rise-slow" style={{ animationDelay: '3s' }} />
    <div className="absolute left-[80%] w-3.5 h-3.5 bg-white/20 rounded-full animate-bubble-rise-slow" style={{ animationDelay: '6s' }} />
    <div className="absolute left-[25%] w-2 h-2 bg-white/35 rounded-full animate-bubble-rise-fast" style={{ animationDelay: '1.5s' }} />
    <div className="absolute left-[60%] w-3 h-3 bg-white/30 rounded-full animate-bubble-rise-fast" style={{ animationDelay: '5s' }} />
    <div className="absolute left-[90%] w-2.5 h-2.5 bg-white/25 rounded-full animate-bubble-rise-fast" style={{ animationDelay: '9s' }} />
  </div>
);

// === COUNTDOWN TIMER COMPONENT ===
const CountdownTimer = ({ schedule }) => {
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });

  useEffect(() => {
    const targetDate = getCountdownTarget(schedule);
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ hari: 0, jam: 0, menit: 0, detik: 0 });
        return;
      }

      setTimeLeft({
        hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
        jam: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        menit: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        detik: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [schedule]);

  const timeUnits = [
    { label: 'Hari', val: timeLeft.hari, grad: 'from-amber-400 to-orange-500' },
    { label: 'Jam', val: timeLeft.jam, grad: 'from-cyan-400 to-blue-600' },
    { label: 'Menit', val: timeLeft.menit, grad: 'from-pink-400 to-rose-600' },
    { label: 'Detik', val: timeLeft.detik, grad: 'from-emerald-400 to-teal-600' }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center my-5">
      {timeUnits.map((item, idx) => (
        <div 
          key={idx} 
          className={`bg-gradient-to-br ${item.grad} rounded-2xl p-2.5 shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-white/20 transform hover:scale-105 transition-transform`}
        >
          <span className="block text-2xl font-extrabold text-white drop-shadow-md font-sans-clean">
            {String(item.val).padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-white/95">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
// === MAIN COMPONENT ===
export default function BabyInvitation({ config: providedConfig = null }) {
  const config = providedConfig || getActiveInvitationConfig();
  const theme = getInvitationTheme(config.theme);
  const themeStyle = {
    '--invitation-primary': theme.primary,
    '--invitation-accent': theme.accent,
    '--invitation-background': theme.background,
    '--invitation-text': theme.text,
  };
  const fallbackImage = config.media?.fallbackImage || defaultInvitationConfig.media.fallbackImage;
  const galleryPhotos = getGalleryPhotos(config);
  const audioUrl = config.media?.musicUrl || '';
  const hasDirectAudio = isDirectAudioUrl(audioUrl);
  const hasSoundCloudAudio = isSoundCloudUrl(audioUrl);
  const firstAvailableTab =
    [
      config.sections?.cover && 'opening',
      config.sections?.profile && 'profil',
      config.sections?.event && 'acara',
      (config.sections?.gallery || (config.sections?.wishes && config.wishes?.enabled)) && 'ucapan',
      ((config.sections?.gift && config.gift?.enabled) || config.sections?.closing) && 'thanks',
    ].find(Boolean) || 'opening';

  // State management
  const [isOpen, setIsOpen] = useState(() => !config.sections?.cover);
  const [activeTab, setActiveTab] = useState(firstAvailableTab);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState(config.guest?.defaultName || defaultInvitationConfig.guest.defaultName);
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Audio reference
  const audioRef = useRef(null);

  // Wishes state
  const [wishes, setWishes] = useState([
    { 
      name: "Keluarga Besar Baiman", 
      status: "Hadir", 
      message: "Selamat atas tasyakuran aqiqah Shaqeel. Semoga tumbuh sehat, menjadi anak shaleh penyejuk hati orang tua, dan pembawa keberkahan keluarga. Amin." 
    },
    { 
      name: "Ahmad Rizky & Istri", 
      status: "Hadir", 
      message: "Barakallahu fiikum. Selamat ya Pak Asbudi dan Ibu Dahlia atas kelahiran putra yang tampan dan rupawan ini." 
    },
    { 
      name: "Siti Rahmah", 
      status: "Tentatif", 
      message: "Semoga ananda tercinta menjadi anak yang pintar, taat beragama, dan berbakti senantiasa." 
    }
  ]);

  // Form state
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState('Hadir');
  const [formMessage, setFormMessage] = useState('');

  // Navigation tabs
  const navigationTabs = [
    { id: 'opening', label: 'Cover', icon: Home, color: 'text-cyan-500', enabled: config.sections?.cover },
    { id: 'profil', label: 'Profil', icon: User, color: 'text-pink-500', enabled: config.sections?.profile },
    { id: 'acara', label: 'Acara', icon: Calendar, color: 'text-amber-500', enabled: config.sections?.event },
    { id: 'ucapan', label: 'Ucapan', icon: MessageSquare, color: 'text-purple-500', enabled: config.sections?.gallery || (config.sections?.wishes && config.wishes?.enabled) },
    { id: 'thanks', label: 'Thanks', icon: Heart, color: 'text-rose-500', enabled: (config.sections?.gift && config.gift?.enabled) || config.sections?.closing }
  ].filter((tab) => tab.enabled);

  // Effects
  useEffect(() => {
    setGuestName(getGuestNameFromUrl(config.guest?.defaultName || defaultInvitationConfig.guest.defaultName));

    // Setup audio
    if (hasDirectAudio) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [audioUrl, config.guest?.defaultName, hasDirectAudio]);

  // Event handlers
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (!audioRef.current) return;

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.log("Autoplay blocked:", err);
        setIsPlaying(false);
      });
  };

  const handleToggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleCopyClipboard = (text, key) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    
    setCopiedAccount(key);
    showToast("Nomor Rekening Berhasil Disalin!");
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handlePostWish = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) {
      showToast("Harap isi Nama & Do'a Anda");
      return;
    }

    const newWish = { name: formName, status: formStatus, message: formMessage };
    setWishes([newWish, ...wishes]);

    if (config.wishes?.whatsappNumber) {
      const message = `${config.wishes.defaultMessage || ''}\n\nNama: ${formName}\nStatus: ${formStatus}\nUcapan: ${formMessage}`.trim();
      window.open(`https://wa.me/${config.wishes.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    }

    setFormName('');
    setFormMessage('');
    showToast("Do'a & Ucapan terkirim!");
  };

  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
    }
  };

  return (
    <div
      className="digital-invitation relative min-h-screen w-full max-w-md mx-auto bg-[#e0f7fa] text-[#002855] flex flex-col justify-between shadow-[0_0_50px_rgba(0,180,216,0.25)] font-sans-clean overflow-hidden"
      data-theme={theme.id}
      style={themeStyle}
    >
      <MarineStyles />
      <InvitationThemeStyles />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-md border border-cyan-200/50 text-[#0077b6] text-xs py-2.5 px-5 rounded-full shadow-lg flex items-center space-x-2 animate-underwater-float">
          <Sparkles size={14} className="text-amber-400 animate-spin" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Audio Controller */}
      {isOpen && hasDirectAudio && (
        <button 
          onClick={handleToggleAudio}
          className="invitation-icon-button invitation-floating-audio fixed bottom-24 z-50"
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400/30 animate-ping" />
              <Volume2 size={20} className="text-[#0077b6]" />
            </div>
          ) : (
            <VolumeX size={20} className="text-slate-400" />
          )}
        </button>
      )}

      {isOpen && hasSoundCloudAudio && (
        <div className="fixed left-1/2 bottom-24 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-1 shadow-xl backdrop-blur-xl">
          <iframe
            className="h-20 w-full rounded-xl border-0"
            title="SoundCloud music"
            src={getSoundCloudEmbedUrl(audioUrl)}
            allow="autoplay"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Cover Page */}
        {!isOpen ? (
          <CoverPage 
            config={config}
            guestName={guestName}
            onOpenInvitation={handleOpenInvitation}
            onImageError={handleImageError}
          />
        ) : (
          /* Main Content */
          <div className="relative flex-1 flex flex-col justify-between">
            <div className="invitation-content no-scrollbar relative flex-1 overflow-y-auto">
              <InvitationBackground themeId={config.theme} />
              
              <AnimatePresence mode="wait">
                {activeTab === 'opening' && (
                  <OpeningTab config={config} />
                )}
                
                {activeTab === 'profil' && (
                  <ProfileTab config={config} onImageError={handleImageError} />
                )}
                
                {activeTab === 'acara' && (
                  <EventTab config={config} />
                )}
                
                {activeTab === 'ucapan' && (
                  <WishesTab 
                    config={config}
                    galleryPhotos={galleryPhotos}
                    wishes={wishes}
                    formName={formName}
                    formStatus={formStatus}
                    formMessage={formMessage}
                    setFormName={setFormName}
                    setFormStatus={setFormStatus}
                    setFormMessage={setFormMessage}
                    setLightboxIndex={setLightboxIndex}
                    onPostWish={handlePostWish}
                    onImageError={handleImageError}
                  />
                )}
                
                {activeTab === 'thanks' && (
                  <ThanksTab 
                    config={config}
                    onCopyClipboard={handleCopyClipboard}
                    copiedAccount={copiedAccount}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Gallery Lightbox */}
            {lightboxIndex !== null && (
              <GalleryLightbox 
                galleryPhotos={galleryPhotos}
                lightboxIndex={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onImageError={handleImageError}
              />
            )}

            {/* Navigation Bar */}
            <NavigationBar 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={navigationTabs}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// === TAB COMPONENTS ===
const CoverPage = ({ config, guestName, onOpenInvitation, onImageError }) => (
  <motion.div
    key="cover"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, y: -40, transition: { duration: 0.6, ease: "easeInOut" } }}
    className="absolute inset-0 z-50 flex flex-col justify-around items-center px-6 py-12 text-center overflow-hidden"
  >
    <InvitationBackground themeId={config.theme} />
    
    {/* Header */}
    <div className="relative z-10 w-full mt-2 space-y-2 animate-underwater-float">
      <div className="w-14 h-14 mx-auto mb-2 text-[#0077b6] flex items-center justify-center bg-white/60 rounded-full border border-white/80 shadow-md">
        <Sparkles size={24} className="animate-pulse text-amber-400" />
      </div>
      <p className="text-[#0077b6] tracking-[0.25em] text-[10px] uppercase font-bold drop-shadow-xs">
        {config.title}
      </p>
      <h1 className="font-serif-elegant text-3xl font-extrabold text-[#003049] tracking-wide mt-1 drop-shadow-md">
        {config.subject?.name}
      </h1>
      <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-[#0077b6]/30 to-transparent mx-auto mt-2" />
    </div>

    {/* Baby Photo Frame */}
    <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center">
      <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-[#00ffff] via-sky-400 to-amber-300 shadow-[0_12px_40px_rgba(0,180,216,0.35)] animate-ring-pulse max-w-[235px] w-full overflow-hidden">
        <div className="w-full rounded-[20px] overflow-hidden border-4 border-white aspect-[4/3] bg-slate-100 flex items-center justify-center shadow-inner">
          <img 
            src={config.media?.coverImage || config.media?.fallbackImage} 
            alt={config.subject?.name || config.title} 
            className="w-full h-full object-cover scale-102 hover:scale-105 transition-transform duration-500"
            onError={onImageError}
          />
        </div>
      </div>
      <span className="inline-block mt-4 text-[10px] font-bold text-[#0369a1] tracking-widest uppercase bg-white/90 px-4 py-1.5 rounded-full border border-sky-200 shadow-md">
        {getEventTitle(config)}
      </span>
    </div>

    {/* Guest Info & Open Button */}
    <div className="relative z-10 w-full max-w-[310px] space-y-5">
      <div className="invitation-card p-4">
        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Kepada Yth. Bapak/Ibu/Sdr/i</p>
        <div className="text-base font-bold text-[#003049] truncate font-serif-elegant">{guestName}</div>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={onOpenInvitation}
          className="invitation-primary-button group relative"
        >
          <Users size={16} className="text-white group-hover:scale-110 transition-transform" />
          <span>BUKA UNDANGAN</span>
          <ChevronRight size={14} className="text-white" />
        </button>
        
        <p className="text-[9px] text-[#0077b6] tracking-widest uppercase font-bold drop-shadow-xs">
          AQUATIC MEMORIES INVITATION
        </p>
      </div>
    </div>
  </motion.div>
);

const OpeningTab = ({ config }) => (
  <motion.div
    key="opening"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4 }}
    className="relative z-10 space-y-6 pt-4 animate-underwater-float"
  >
    <div className="text-center">
      <span className="text-[#0077b6] tracking-[0.25em] text-[10px] uppercase font-bold drop-shadow-xs">
        {getEventTitle(config)}
      </span>
      <h2 className="font-serif-elegant text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#003049] via-[#0077b6] to-[#003049] drop-shadow-xs mt-1">
        {config.title}
      </h2>
      <p className="font-serif-elegant text-lg italic text-[#0077b6] mt-1">{config.subject?.name}</p>
    </div>
    
    <div className="invitation-card p-6 text-center space-y-4">
      <h3 className="font-serif-elegant text-xl font-bold text-[#003049]">Kehadiran Anda</h3>
      <div className="h-[1.5px] w-14 bg-gradient-to-r from-transparent via-[#0077b6]/40 to-transparent mx-auto" />
      
      <p className="text-xs text-slate-700 leading-relaxed font-light">
        "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?" <br/>
        <span className="text-[#0077b6] font-bold mt-1 block">(QS. Ar-Rahman: 13)</span>
      </p>
      
      <p className="text-xs text-slate-600 leading-relaxed font-light pt-2">
        {config.subtitle}
      </p>
    </div>
  </motion.div>
);

const ProfileTab = ({ config, onImageError }) => (
  <motion.div
    key="profil"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4 }}
    className="relative z-10 space-y-5 pt-2 animate-underwater-float"
  >
    <div className="invitation-card p-5 text-center space-y-5">
      <div className="space-y-1.5">
        <p className="font-serif-elegant text-base text-[#0077b6] italic font-semibold">
          Assalamu'alaikum Wr. Wb.
        </p>
        <p className="text-xs leading-relaxed text-slate-600 font-light">
          Dengan memohon rahmat dan ridho Allah SWT, kami sekeluarga bermaksud menyelenggarakan
          {` ${getEventTitle(config).toLowerCase()} untuk:`}
        </p>
      </div>

      {/* Profile Photo */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-200/50 shadow-md group">
        <img 
          src={config.media?.profileImage || config.media?.coverImage || config.media?.fallbackImage} 
          alt={config.subject?.name || config.title} 
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" 
          onError={onImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 text-left">
          <span className="px-2 py-0.5 bg-[#00b4d8] text-white rounded text-[8px] font-bold tracking-widest uppercase shadow-sm">
            PROFIL
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#003049] via-[#0077b6] to-[#03045e] font-serif-elegant">
          {config.subject?.name}
        </h2>
        <p className="text-xs text-[#0077b6] font-semibold italic">{config.subject?.description}</p>
      </div>

      <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#0077b6]/30 to-transparent mx-auto" />
      
      <p className="text-[11px] text-slate-500 italic leading-relaxed font-light">
        "Ya Allah, peliharalah anak ini selama ia berada di dalam kandungan ibunya, dan sehatkanlah dia bersama ibunya. 
        Jadikanlah ia anak yang sholeh."
      </p>
    </div>
  </motion.div>
);

const EventTab = ({ config }) => (
  <motion.div
    key="acara"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4 }}
    className="relative z-10 space-y-5 pt-2 animate-underwater-float"
  >
    {/* Event Schedule */}
    <div className="invitation-card p-5 text-center space-y-4">
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#e0f2fe] border border-cyan-300/40 rounded-full">
        <Clock size={12} className="text-[#0077b6] animate-spin" />
        <span className="text-[9px] font-bold text-[#0077b6] uppercase tracking-wider">Agendakan Acara</span>
      </div>
      
      <h3 className="font-serif-elegant text-2xl font-bold text-[#003049] tracking-wide">{config.schedule?.displayDate}</h3>
      
      <div className="grid grid-cols-2 gap-3 text-left">
        <div className="bg-gradient-to-br from-[#e0f7fa] to-[#b2f5ea] border border-cyan-200/50 rounded-2xl p-3.5 space-y-1 shadow-sm">
          <p className="text-[10px] font-bold text-[#0077b6] uppercase tracking-wide">Waktu</p>
          <p className="text-sm font-extrabold text-[#003049]">{config.schedule?.time}</p>
          <p className="text-[9px] text-[#0077b6]/80 font-bold uppercase">{config.schedule?.timezone}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#e0f7fa] to-[#b2f5ea] border border-cyan-200/50 rounded-2xl p-3.5 space-y-1 shadow-sm">
          <p className="text-[10px] font-bold text-[#0077b6] uppercase tracking-wide">Acara</p>
          <p className="text-sm font-extrabold text-[#003049]">{getEventTitle(config)}</p>
          <p className="text-[9px] text-[#0077b6]/80 font-bold uppercase">{config.eventType}</p>
        </div>
      </div>
      
      <CountdownTimer schedule={config.schedule} />
    </div>

    {/* Location & Maps */}
    <div className="invitation-card p-5 space-y-4">
      <div className="flex items-start space-x-3 text-left">
        <div className="p-2 bg-[#e0f2fe] border border-cyan-300/40 rounded-xl text-[#0077b6] mt-0.5 shadow-sm">
          <MapPin size={18} className="text-rose-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#003049]">{config.location?.name}</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-light mt-0.5">
            {config.location?.address}
          </p>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="w-full h-44 rounded-2xl overflow-hidden border-2 border-cyan-300/60 shadow-[0_4px_20px_rgba(0,180,216,0.15)] relative">
        <iframe 
          title="Lokasi Google Maps"
          src={config.location?.mapsEmbedUrl}
          className="w-full h-full border-0 contrast-[1.05] brightness-[1.0]"
          allowFullScreen="" 
          loading="lazy"
        />
      </div>
      
      <a 
        href={config.location?.mapsLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="invitation-primary-button"
      >
        <ExternalLink size={14} />
        <span>PETUNJUK KE LOKASI</span>
      </a>
    </div>
  </motion.div>
);
const WishesTab = ({ 
  config,
  galleryPhotos, 
  wishes, 
  formName, 
  formStatus, 
  formMessage,
  setFormName, 
  setFormStatus, 
  setFormMessage,
  setLightboxIndex,
  onPostWish,
  onImageError 
}) => (
  <motion.div
    key="ucapan"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4 }}
    className="relative z-10 space-y-5 pt-2 animate-underwater-float"
  >
    {config.sections?.gallery ? (
    <div className="invitation-card p-4 space-y-3">
      <h4 className="text-xs font-bold text-[#0077b6] uppercase tracking-widest text-center">
        Galeri {config.subject?.name}
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        {galleryPhotos.map((photo, i) => (
          <div 
            key={i} 
            onClick={() => setLightboxIndex(i)}
            className="relative h-28 rounded-xl overflow-hidden border border-cyan-200/50 shadow-sm cursor-pointer group active:scale-95 transition-all"
          >
            <img 
              src={photo.src} 
              alt="Baby gallery" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              onError={onImageError}
            />
            <div className="absolute inset-0 bg-cyan-950/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-1.5 left-2 right-2 truncate bg-white/90 backdrop-blur-xs py-0.5 px-1.5 rounded text-[8px] text-[#0077b6] text-center font-bold shadow-sm">
              {photo.caption.split(' ')[1] || 'Foto'} {photo.caption.split(' ')[2] || ''}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-[9px] text-slate-500 text-center italic">*Klik foto untuk memperbesar gambar</p>
    </div>
    ) : null}

    {config.sections?.wishes && config.wishes?.enabled ? (
    <div className="invitation-card p-5 space-y-4">
      <div className="text-center space-y-0.5">
        <h3 className="font-serif-elegant text-lg font-bold text-[#003049]">Kirim Ucapan & Do'a</h3>
        <p className="text-xs text-slate-600 font-light">Berikan restu hangat Anda untuk acara ini</p>
      </div>
      
      <form onSubmit={onPostWish} className="space-y-3">
        <input 
          type="text" 
          required
          placeholder="Nama Lengkap Anda"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="w-full bg-white/90 border border-cyan-200/60 rounded-xl px-4 py-2.5 text-xs text-[#003049] placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-all shadow-xs"
        />

        {/* Status Selection */}
        <div className="grid grid-cols-3 gap-2">
          {['Hadir', 'Tentatif', 'Absen'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFormStatus(status)}
              className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all border ${
                formStatus === status 
                  ? 'bg-[#e0f7fa] text-[#0077b6] border-cyan-400/60 shadow-xs' 
                  : 'bg-white/50 text-slate-500 border-slate-200 hover:border-cyan-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <textarea 
          rows="3" 
          required
          placeholder="Do'a tulus Anda..."
          value={formMessage}
          onChange={(e) => setFormMessage(e.target.value)}
          className="w-full bg-white/90 border border-cyan-200/60 rounded-xl px-4 py-2 text-xs text-[#003049] placeholder-slate-400 focus:outline-none focus:border-cyan-400 resize-none transition-all shadow-xs"
        />

        <button 
          type="submit" 
          className="invitation-primary-button"
        >
          <Send size={13} className="text-white" />
          <span>KIRIM DO'A & RESTU</span>
        </button>
      </form>

      {/* Wishes List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[#0077b6] font-bold">
            Do'a Tamu ({wishes.length})
          </span>
          <span className="text-[8px] text-slate-400 font-bold">Scroll kebawah</span>
        </div>
        
        <div className="no-scrollbar max-h-36 overflow-y-auto space-y-2 pr-1">
          {wishes.map((wish, idx) => (
            <div key={idx} className="bg-white/60 border border-cyan-100/55 hover:border-cyan-200 rounded-xl p-3 text-[11px] space-y-1 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#003049]">{wish.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                  wish.status === 'Hadir' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                  wish.status === 'Tentatif' 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    'bg-rose-100 text-rose-700 border border-rose-200'
                }`}>
                  {wish.status}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed font-light">{wish.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    ) : null}
  </motion.div>
);

const ThanksTab = ({ config, onCopyClipboard, copiedAccount }) => {
  const hostLine = getHostLine(config);
  const accounts = config.gift?.accounts || [];

  return (
  <motion.div
    key="thanks"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4 }}
    className="relative z-10 space-y-5 pt-2 animate-underwater-float"
  >
    {config.sections?.closing ? (
    <div className="invitation-card p-6 text-center space-y-4">
      <Heart className="mx-auto text-rose-500 fill-rose-500/20 animate-pulse" size={28} />
      
      <p className="text-xs leading-relaxed text-slate-600 font-light">
        Kehadiran serta do'a restu Bapak/Ibu/Saudara/i sekalian merupakan suatu kehormatan dan kebahagiaan 
        yang tidak ternilai bagi kami sekeluarga.
      </p>
      
      <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#0077b6]/30 to-transparent mx-auto" />
      
      <div>
        <p className="text-[9px] text-[#0077b6] uppercase tracking-widest font-bold">Kami Yang Mengundang</p>
        <p className="font-serif-elegant font-bold text-base text-[#003049] mt-0.5">
          {hostLine || config.subject?.description}
        </p>
      </div>
    </div>
    ) : null}

    {config.sections?.gift && config.gift?.enabled && accounts.length ? (
    <div className="invitation-card p-5 space-y-4">
      <div className="flex items-center space-x-2 justify-center text-[#0077b6] text-xs font-bold uppercase tracking-widest">
        <Gift size={13} className="animate-bounce text-amber-500" />
        <span>Kirim Kado</span>
      </div>
      
      <div className="space-y-2">
        {accounts.map((account, index) => {
          const accountKey = `${account.bank}-${account.number}-${index}`;

          return (
            <div key={accountKey} className="bg-[#f0f9ff] border border-cyan-150 rounded-2xl p-4 flex justify-between items-center shadow-xs">
              <div className="text-left space-y-0.5">
                <span className="text-[8px] font-bold text-[#0077b6] uppercase block">{account.bank}</span>
                <span className="text-xs font-bold text-[#003049] block select-all">{account.number}</span>
                <span className="text-[9px] text-slate-500 block">a.n. {account.name}</span>
              </div>
              <button
                onClick={() => onCopyClipboard(account.copyText || account.number, accountKey)}
                className="invitation-icon-button"
              >
                {copiedAccount === accountKey ?
                  <Check size={14} className="text-emerald-500" /> :
                  <Copy size={14} />
                }
              </button>
            </div>
          );
        })}
      </div>
    </div>
    ) : null}

    {/* Footer */}
    <div className="text-center pt-2 space-y-1.5 text-slate-500">
      <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#0077b6]">
        Wassalamu'alaikum Wr. Wb.
      </p>
      <p className="text-[8px] tracking-wider">
        Digital Invitation © 2026 Aquatic Memories • Premium Design
      </p>
    </div>
  </motion.div>
  );
};

const GalleryLightbox = ({ galleryPhotos, lightboxIndex, onClose, onImageError }) => (
  <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-4">
    <button 
      onClick={onClose}
      className="absolute top-4 right-4 py-2 px-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors text-xs font-semibold"
    >
      ✕ Tutup
    </button>
    
    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/10">
      <img 
        src={galleryPhotos[lightboxIndex].src} 
        alt={galleryPhotos[lightboxIndex].caption} 
        className="w-full max-h-[400px] object-cover" 
        onError={onImageError}
      />
      <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 p-3 text-center border-t border-white/5">
        <p className="text-xs text-white/90 font-medium">{galleryPhotos[lightboxIndex].caption}</p>
      </div>
    </div>
  </div>
);

const NavigationBar = ({ activeTab, onTabChange, tabs }) => (
  <nav className="invitation-bottom-nav">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`invitation-nav-button relative focus:outline-none ${
            isActive ? 'invitation-nav-button-active' : ''
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${
            isActive ? 'invitation-nav-icon-active' : ''
          }`}>
            <Icon size={16} />
          </div>
          
          <span className="text-[9px] font-bold tracking-wider transition-colors">
            {tab.label}
          </span>
          
          {isActive && (
            <motion.div 
              layoutId="activeIndicator"
              className="absolute bottom-0 w-6 h-[2px] bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      );
    })}
  </nav>
);
