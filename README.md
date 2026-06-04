# Digital Invitation Template Builder

Static React app untuk membuat dan menampilkan undangan digital reusable. App punya dua mode:

- `/` untuk halaman undangan tamu.
- `/builder` untuk mengatur konten, tema, media, lokasi, rekening, section, import, export, dan draft lokal.

## Features

- Config-driven invitation content.
- Nama tamu dari query URL, contoh `/?to=Bapak%20Andi`.
- Builder dengan live preview, draft localStorage, import JSON, export JSON, dan reset default.
- Tema dasar marine dan elegant.
- Section bisa dinyalakan atau dimatikan.
- Galeri foto URL dengan lightbox.
- Countdown acara.
- Google Maps embed dan link navigasi.
- Musik latar opsional.
- Amplop digital dengan banyak rekening dan tombol copy.
- Form ucapan lokal, plus redirect WhatsApp jika nomor penerima diisi.

## Getting Started

```bash
npm install
npm run dev
```

Buka:

- `http://localhost:5173/`
- `http://localhost:5173/builder`

Di PowerShell yang memblokir `npm.ps1`, gunakan:

```bash
npm.cmd run dev
```

## Production Build

```bash
npm run build
```

Untuk mencoba hasil build secara static dengan fallback route SPA:

```bash
npm run serve:dist
```

Default URL:

- `http://127.0.0.1:5173/`
- `http://127.0.0.1:5173/builder`

Port dan host bisa diubah:

```bash
$env:PORT='8080'; $env:HOST='127.0.0.1'; npm.cmd run serve:dist
```

## Configuration

Default config ada di:

```text
src/config/defaultInvitationConfig.js
```

Theme ada di:

```text
src/config/themes.js
```

Builder menyimpan draft di browser localStorage. Klik `Export` di `/builder` untuk menyimpan config JSON yang bisa dipakai ulang.

## Scripts

- `npm run dev` menjalankan Vite dev server.
- `npm run build` membuat bundle production ke `dist`.
- `npm run preview` menjalankan preview Vite.
- `npm run serve:dist` menyajikan folder `dist` dengan fallback ke `index.html`.
- `npm run lint` menjalankan ESLint.

## Deployment

### Cloudflare Pages

Gunakan setting berikut di Cloudflare Pages:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: kosongkan atau `/`

Jika upload manual, upload isi folder `dist`, bukan root project. File `public/_redirects` akan ikut masuk ke `dist` saat build supaya route seperti `/builder` dan `/templates` tetap diarahkan ke `index.html`.

Jika log Cloudflare menampilkan `No build command specified. Skipping build step.`, berarti Build command di dashboard masih kosong. Isi `npm run build`, lalu lakukan redeploy.

### Static Hosting Lain

Deploy folder `dist` ke static hosting seperti Netlify, Vercel, GitHub Pages, Firebase Hosting, atau server static lain. Pastikan semua route diarahkan ke `index.html` agar `/builder` tetap bisa dibuka.
