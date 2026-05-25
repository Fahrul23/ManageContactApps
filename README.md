# Nexus Connect - Contact Management App

Aplikasi Contact Management (Manajemen Kontak) berbasis React, Redux Toolkit, dan Vite. Aplikasi ini telah dilengkapi dengan fitur manajemen kontak lengkap, penanda kontak favorit, serta pemfilteran dan pencarian.

## Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di perangkat Anda.

## Cara Menjalankan Proyek

1. **Instalasi Dependensi**
   Jalankan perintah berikut di terminal pada direktori proyek untuk menginstal semua library yang dibutuhkan:
   ```bash
   npm install
   ```

2. **Menjalankan Dev Server (Lokal)**
   Jalankan perintah berikut untuk menjalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Setelah dijalankan, buka alamat URL yang tertera di terminal (biasanya `http://localhost:5173`) pada browser Anda.

3. **Membuat Build Produksi**
   Untuk melakukan kompilasi proyek ke file produksi yang siap di-deploy:
   ```bash
   npm run build
   ```
   Hasil build akan disimpan di folder `dist`.

## Cara Menjalankan Unit Test

Proyek ini menggunakan **Jest** untuk pengujian unit (unit testing).

1. **Menjalankan Semua Test Sekali Saja**
   Jalankan perintah berikut untuk mengeksekusi seluruh rangkaian pengujian:
   ```bash
   npm run test
   ```

2. **Menjalankan Test dalam Watch Mode**
   Jalankan perintah berikut jika Anda ingin Jest tetap berjalan dan memantau perubahan file secara otomatis untuk mengulang pengujian:
   ```bash
   npm run test:watch
   ```

3. **Menghasilkan Laporan Coverage**
   Jalankan perintah berikut untuk melihat cakupan kode (test coverage) dari pengujian yang telah dibuat:
   ```bash
   npm run test:coverage
   ```
