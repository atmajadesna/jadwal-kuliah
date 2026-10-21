<div align="center">

# Jadwal Kuliah

**Grid jadwal mingguan dengan deteksi bentrok jam dan ruang.**

[![Demo](https://img.shields.io/badge/demo-live-b45309?style=flat-square)](https://atmajadesna.github.io/jadwal-kuliah/)
![Tanpa build step](https://img.shields.io/badge/build-tanpa%20build%20step-2f6f4f?style=flat-square)
![Lisensi MIT](https://img.shields.io/badge/lisensi-MIT-1f4e79?style=flat-square)

<a href="https://atmajadesna.github.io/jadwal-kuliah/"><img src="docs/screenshot.jpg" alt="Tangkapan layar Jadwal Kuliah" width="100%"></a>

</div>

## Masalahnya

Jadwal kampus sering bentrok tanpa disadari — dua mata kuliah di jam yang sama, atau dua kelas memakai satu ruang. Ketahuan belakangan, saat sudah terlambat.

## Yang menarik di dalamnya

**Deteksi bentrok** — Dua blok bentrok kalau harinya sama dan rentang jamnya beririsan: `a.mulai < b.selesai && b.mulai < a.selesai`.
**Ruang ikut dicek** — Bentrok dilaporkan beserta nama ruangnya, bukan cuma "ada bentrok".
**Total SKS otomatis** — SKS dijumlah dari mata kuliah yang aktif.
**Responsif** — Di layar sempit, grid berubah jadi agenda per hari.

## Jalanin

Buka `index.html` di browser.

```bash
python3 -m http.server 8000
```

Tidak ada dependency, tidak ada build step. Semua jalan di browser.

## Struktur

```
index.html    tampilan dan struktur halaman
app.js        seluruh logika: data, hitungan, penyimpanan
styles.css    tata letak dan komponen
tokens.css    warna, ukuran teks, dan spasi sebagai variabel
```

## Catatan

Data jadwal disimpan di `localStorage`, jadi tetap ada setelah halaman ditutup.

Dibuat dengan JavaScript, CSS Grid, HTML, tanpa framework.
