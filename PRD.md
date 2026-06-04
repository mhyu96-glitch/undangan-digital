# PRD: Digital Invitation Template Builder

**Versi:** MVP 1.0  
**Tanggal:** 4 Juni 2026  
**Status:** Draft Final  
**Produk:** Static web app untuk membuat undangan digital reusable

## 1. Ringkasan Produk

Digital Invitation Template Builder adalah aplikasi web untuk membuat undangan digital yang bisa digunakan berulang untuk berbagai jenis acara. Produk ini terdiri dari dua mode utama:

- **Invitation View:** halaman undangan yang dibuka oleh tamu.
- **Builder View:** halaman `/builder` untuk pembuat undangan mengatur konten, tema, section, media, lokasi, rekening, dan konfigurasi lain.

MVP dibuat sebagai static web app tanpa backend. Semua konten undangan dikendalikan melalui konfigurasi, sehingga satu codebase dapat digunakan untuk banyak acara dengan mengganti data, tema, foto, lokasi, dan section yang aktif.

## 2. Tujuan Produk

- Membuat template undangan digital reusable untuk berbagai acara.
- Memudahkan kustomisasi undangan tanpa mengedit banyak kode.
- Menyediakan builder web sederhana untuk mengatur isi undangan.
- Menghasilkan undangan yang mobile-first, cepat, elegan, dan mudah dibagikan.
- Menyiapkan fondasi agar backend, RSVP, buku tamu online, dan dashboard dapat ditambahkan pada fase berikutnya.

## 3. Target Pengguna

### Pembuat Undangan

Developer, admin teknis, atau penyedia jasa undangan digital yang ingin membuat banyak undangan dari satu template.

### Penyelenggara Acara

Keluarga, individu, atau panitia acara yang ingin membagikan undangan digital kepada tamu.

### Tamu Undangan

Penerima link undangan melalui WhatsApp, media sosial, atau kanal digital lain.

## 4. Jenis Acara yang Didukung

MVP harus mendukung acara umum, bukan hanya aqiqah.

Contoh acara:

- Aqiqah
- Ulang tahun
- Syukuran
- Tasyakuran
- Khitanan
- Gathering keluarga
- Acara custom lainnya

Setiap jenis acara memakai struktur data umum: judul acara, subjek acara, penyelenggara, tanggal, lokasi, galeri, ucapan, amplop digital, dan penutup.

## 5. Scope MVP

MVP mencakup:

- Halaman undangan untuk tamu.
- Halaman builder di `/builder`.
- Konten berbasis config.
- Nama tamu dari URL parameter, misalnya `?to=Bapak%20Andi`.
- Pilihan tema dasar.
- Section undangan bisa diaktifkan atau dinonaktifkan.
- Galeri foto berbasis URL.
- Musik latar opsional.
- Countdown acara.
- Google Maps link dan embed.
- Amplop digital opsional.
- Tombol copy nomor rekening.
- Kirim ucapan melalui WhatsApp.
- Draft builder tersimpan di localStorage.
- Import dan export config JSON.
- Preview undangan dari builder.

## 6. Di Luar Scope MVP

Fitur berikut tidak dikerjakan di MVP:

- Login admin.
- Database online.
- RSVP online.
- Buku tamu online permanen.
- Upload foto ke server.
- Dashboard multi-event.
- Generate link tamu massal.
- Payment gateway.
- Template marketplace.
- Analytics kunjungan.

## 7. Mode Produk

### 7.1 Invitation View

Halaman yang dibuka oleh tamu undangan. Fokusnya adalah pengalaman membaca undangan yang indah, ringan, dan mudah digunakan di ponsel.

Invitation View harus dapat:

- Membaca data dari config.
- Membaca nama tamu dari URL.
- Menampilkan cover undangan.
- Menampilkan detail acara.
- Menampilkan jadwal dan lokasi.
- Menampilkan countdown.
- Menampilkan galeri.
- Menampilkan amplop digital jika aktif.
- Mengirim ucapan melalui WhatsApp.
- Menampilkan penutup.

### 7.2 Builder View

Halaman di `/builder` untuk pembuat undangan mengatur data acara, media, tema, section, rekening, lokasi, dan ucapan WhatsApp. Builder tidak membutuhkan login pada MVP.

Builder View harus dapat:

- Mengedit data undangan lewat form.
- Menampilkan preview.
- Menyimpan draft ke browser.
- Import config JSON.
- Export config JSON.
- Reset ke default config.

## 8. User Flow Tamu

1. Tamu menerima link undangan.
2. Tamu membuka link.
3. Sistem membaca nama tamu dari URL.
4. Tamu melihat cover undangan.
5. Tamu membuka isi undangan.
6. Tamu melihat detail acara, countdown, lokasi, galeri, dan amplop digital.
7. Tamu dapat menyalin rekening jika amplop digital aktif.
8. Tamu dapat mengirim ucapan melalui WhatsApp.
9. Tamu dapat membagikan link undangan.

## 9. User Flow Builder

1. Pembuat undangan membuka `/builder`.
2. Pembuat undangan mengisi data dasar acara.
3. Pembuat undangan memilih jenis acara dan tema.
4. Pembuat undangan mengatur tanggal, waktu, lokasi, foto, musik, dan rekening.
5. Pembuat undangan mengaktifkan atau menonaktifkan section undangan.
6. Pembuat undangan melihat preview.
7. Pembuat undangan menyimpan draft di browser.
8. Pembuat undangan export config JSON.
9. Config digunakan untuk build atau deploy undangan.

## 10. Functional Requirements

### 10.1 Invitation Page

Halaman undangan harus dapat:

- Menampilkan konten dari config.
- Menampilkan nama tamu dari URL.
- Menampilkan cover undangan.
- Menampilkan detail subjek acara.
- Menampilkan informasi tanggal dan waktu.
- Menampilkan countdown.
- Menampilkan lokasi dan tombol buka Google Maps.
- Menampilkan galeri foto.
- Memutar musik latar jika tersedia.
- Menampilkan amplop digital jika aktif.
- Menyalin nomor rekening.
- Membuat pesan ucapan WhatsApp otomatis.
- Menyembunyikan section berdasarkan config.

### 10.2 Builder Page

Builder harus dapat:

- Mengedit data acara.
- Mengedit data penyelenggara.
- Mengedit tanggal, waktu, dan zona waktu.
- Mengedit lokasi dan Google Maps.
- Mengedit media melalui URL.
- Mengedit data amplop digital.
- Mengedit nomor WhatsApp penerima ucapan.
- Mengatur section aktif atau nonaktif.
- Memilih tema.
- Menampilkan preview.
- Menyimpan draft ke localStorage.
- Import config JSON.
- Export config JSON.
- Reset ke default config.

## 11. Builder Form Sections

Builder MVP dibagi menjadi beberapa bagian:

- **Basic:** jenis acara, judul, subtitle, nama subjek acara, deskripsi.
- **Host:** nama penyelenggara, keluarga, atau panitia.
- **Schedule:** tanggal, waktu, zona waktu, dan label tanggal tampil.
- **Location:** nama lokasi, alamat, Google Maps link, dan embed URL.
- **Media:** cover image, profile image, gallery image URLs, dan music URL.
- **Gift:** status amplop digital, nama bank, nomor rekening, nama pemilik rekening.
- **Wishes:** nomor WhatsApp penerima ucapan dan template pesan.
- **Sections:** toggle cover, profile, event, gallery, gift, wishes, dan closing.
- **Theme:** pilihan tema visual.
- **Preview:** pratinjau undangan berdasarkan config aktif.
- **Import/Export:** import config JSON, export config JSON, reset default.

## 12. Struktur Config Minimal

```js
{
  eventType: "aqiqah",
  theme: "marine",
  title: "Undangan Aqiqah",
  subtitle: "Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i",
  guest: {
    defaultName: "Bapak/Ibu/Saudara/i"
  },
  subject: {
    name: "Nama Subjek Acara",
    description: "Deskripsi singkat"
  },
  host: {
    names: ["Nama Penyelenggara"]
  },
  schedule: {
    date: "2026-06-15",
    time: "08:00",
    timezone: "Asia/Makassar",
    displayDate: "Senin, 15 Juni 2026"
  },
  location: {
    name: "Nama Lokasi",
    address: "Alamat lengkap",
    mapsLink: "",
    mapsEmbedUrl: ""
  },
  media: {
    coverImage: "",
    profileImage: "",
    gallery: [],
    musicUrl: "",
    fallbackImage: ""
  },
  gift: {
    enabled: true,
    accounts: [
      {
        bank: "BANK NAME",
        number: "0000000000",
        name: "Nama Pemilik",
        copyText: "0000000000"
      }
    ]
  },
  wishes: {
    enabled: true,
    whatsappNumber: "",
    defaultMessage: "Assalamu'alaikum, saya ingin mengirim ucapan untuk acara ini."
  },
  sections: {
    cover: true,
    profile: true,
    event: true,
    gallery: true,
    gift: true,
    wishes: true,
    closing: true
  }
}
```

## 13. Tema

MVP minimal memiliki dua tema:

- **marine:** tema laut, berdasarkan desain existing.
- **elegant:** tema netral untuk acara umum.

Tema harus dikendalikan dari config agar undangan dapat dipakai ulang untuk berbagai jenis acara.

Theme config minimal mencakup:

- Warna utama.
- Warna aksen.
- Warna background.
- Font heading.
- Font body.
- Gaya ornamen atau dekorasi.

## 14. Non-Functional Requirements

- Mobile-first.
- Bisa berjalan sebagai static website.
- Build production harus berhasil tanpa error.
- Ringan dibuka di jaringan seluler.
- Tidak membutuhkan backend pada MVP.
- Data acara mudah dipindahkan antar proyek.
- UI tetap rapi saat section dimatikan.
- Gambar memiliki fallback saat gagal dimuat.
- Tombol memiliki tap target nyaman di mobile.
- Struktur siap dikembangkan untuk backend di fase 2.
- Komponen UI dipisahkan dari data acara.
- Konten acara tidak hardcoded di komponen utama.
- Config dapat disimpan, dipindahkan, dan dipakai ulang.

## 15. Phase 2 Roadmap

Fase 2 mencakup:

- Login admin.
- Dashboard multi-event.
- Database acara.
- RSVP online.
- Buku tamu online permanen.
- Upload foto.
- Generate link tamu personal.
- Export daftar tamu.
- Analytics kunjungan.
- Template marketplace.
- Integrasi Supabase atau Firebase.

## 16. Acceptance Criteria MVP

MVP dianggap selesai jika:

- Halaman undangan membaca data dari config.
- `/builder` dapat mengedit config utama.
- Builder bisa preview, save draft, import, dan export JSON.
- Nama tamu bisa muncul dari URL.
- Section bisa aktif atau nonaktif dari config.
- Ucapan dapat dikirim via WhatsApp.
- Amplop digital bisa copy nomor rekening.
- Minimal dua tema tersedia.
- App bisa build production tanpa error.
- Hasil undangan nyaman dibuka di mobile dan desktop.

## 17. Keputusan Produk

Keputusan utama untuk MVP:

- Produk diarahkan sebagai template undangan digital reusable, bukan undangan satu acara saja.
- MVP mendukung acara umum.
- Builder tersedia di `/builder`.
- Builder berjalan tanpa backend dan tanpa login.
- Data undangan dikendalikan oleh config.
- Ucapan real diarahkan via WhatsApp.
- LocalStorage dipakai untuk draft builder dan preview/demo.
- Backend, RSVP, buku tamu online, dan dashboard masuk fase 2.

