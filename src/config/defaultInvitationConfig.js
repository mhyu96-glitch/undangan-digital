export const defaultInvitationConfig = {
  eventType: 'aqiqah',
  template: 'best-mix',
  theme: 'marine',
  title: 'Undangan Aqiqah',
  subtitle: 'Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i',
  typography: {
    title: {
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 40,
      color: '#ffffff',
      align: 'center',
      bold: true,
      italic: false,
    },
    subtitle: {
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 14,
      color: '#eafcff',
      align: 'center',
      bold: false,
      italic: false,
    },
  },
  guest: {
    defaultName: 'Bapak/Ibu/Saudara/i',
  },
  subject: {
    name: 'SHAQEEL MUHAMMAD AL-SHAFI',
    description: 'Putra ke-enam Bapak H. Asbudi & Ibu Hj. Dahlia',
  },
  host: {
    names: ['Bapak H. Asbudi', 'Ibu Hj. Dahlia'],
  },
  schedule: {
    date: '2026-06-15',
    time: '08:00',
    timezone: 'Asia/Makassar',
    displayDate: 'Senin, 15 Juni 2026',
  },
  location: {
    name: 'Selili, Samarinda Ilir',
    address: 'Selili, Samarinda Ilir, Samarinda City, East Kalimantan 75251',
    mapsLink: 'https://maps.app.goo.gl/ZuAJPCKKJTerf88A7',
    mapsEmbedUrl:
      'https://maps.google.com/maps?q=Selili,%20Samarinda%20Ilir,%20Samarinda%20City,%20East%20Kalimantan%2075251&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
  media: {
    coverImage: 'https://i.imgur.com/KCEWQZC.jpeg',
    profileImage: 'https://i.imgur.com/U9TcW4Y.jpeg',
    backgroundImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400',
    gallery: [
      'https://i.imgur.com/KCEWQZC.jpeg',
      'https://i.imgur.com/U9TcW4Y.jpeg',
      'https://i.imgur.com/mLFLVOd.jpeg',
      'https://i.imgur.com/hZf4EZ2.jpeg',
    ],
    musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    fallbackImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eb2?q=80&w=600',
  },
  animation: {
    preset: 'gentle-float',
    intensity: 'normal',
  },
  gift: {
    enabled: true,
    accounts: [
      {
        bank: 'BANK MANDIRI',
        number: '1410-0294-8839-2',
        name: 'H. Asbudi',
        copyText: '1410029488392',
      },
      {
        bank: 'BANK BCA',
        number: '782-938-4422',
        name: 'Hj. Dahlia',
        copyText: '7829384422',
      },
    ],
  },
  wishes: {
    enabled: true,
    whatsappNumber: '',
    defaultMessage: "Assalamu'alaikum, saya ingin mengirim ucapan untuk acara ini.",
  },
  sections: {
    cover: true,
    profile: true,
    event: true,
    gallery: true,
    gift: true,
    wishes: true,
    closing: true,
  },
};

export default defaultInvitationConfig;
