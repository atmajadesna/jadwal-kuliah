# Jadwal Kuliah

Susun jadwal kuliah mingguan, dan **ketahui bentroknya sebelum semester jalan**.

## Masalah yang diselesaikan

Jadwal dari bagian akademik biasanya berupa tabel statis. Bentrok jam dan ruang
baru ketahuan saat hari pertama kuliah, atau saat dua mata kuliah ternyata
memakai lab yang sama pada jam yang sama.

Aplikasi ini memeriksa bentrok **saat kamu memasukkan jadwal**, bukan nanti.

## Cara kerja

- Setiap mata kuliah disimpan sebagai menit sejak 00.00, jadi pengecekan bentrok
  cukup aritmetika: dua blok bertabrakan bila `a.mulai < b.selesai && b.mulai < a.selesai`
  pada hari yang sama.
- Kalau ruangnya juga sama, peringatan menyebutkan ruangnya secara eksplisit.
- Blok yang bertabrakan diberi tanda merah di grid, dan jumlah bentrok muncul di
  kepala halaman.
- Total SKS dihitung otomatis.

## Fitur

- Grid mingguan Senin–Sabtu, pukul 07.00–21.00.
- Deteksi bentrok jam **dan** ruang, ditampilkan sebagai daftar, bukan cuma warna.
- Total SKS dan jumlah mata kuliah di kepala halaman.
- Hapus mata kuliah langsung dari blok jadwal (tombol × muncul saat kursor di atas blok).
- Di layar sempit, grid berubah menjadi agenda per hari — tanpa perlu digeser ke samping.
- Tersimpan di `localStorage`.

## Struktur berkas

| Berkas | Isi |
|---|---|
| `index.html` | kepala halaman, formulir, wadah grid |
| `tokens.css` | token warna, huruf, jarak, tinggi baris jam |
| `styles.css` | grid, blok jadwal, agenda versi sempit |
| `app.js` | model waktu, deteksi bentrok, render |

Tanpa dependensi, tanpa build step.

## Batasan

- Satu mata kuliah = satu blok waktu. Kelas dengan dua sesi per minggu harus
  ditambahkan dua kali.
- Belum ada mode "minggu ganjil/genap".
- Belum ada ekspor ke kalender (.ics) — kandidat pengembangan berikutnya.
- Tidak ada sinkronisasi antar perangkat.

## Lisensi

MIT.
