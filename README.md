<div align="center">

# Jadwal Kuliah

**Grid jadwal mingguan dengan pendeteksian benturan jam dan ruang.**

[![Demo](https://img.shields.io/badge/demo-live-b45309?style=flat-square)](https://atmajadesna.github.io/jadwal-kuliah/)
![Tanpa build step](https://img.shields.io/badge/build-tanpa%20build%20step-2f6f4f?style=flat-square)
![Lisensi MIT](https://img.shields.io/badge/lisensi-MIT-1f4e79?style=flat-square)

<a href="https://atmajadesna.github.io/jadwal-kuliah/"><img src="docs/screenshot.jpg" alt="Tangkapan layar Jadwal Kuliah" width="100%"></a>

</div>

## Latar Belakang

Benturan jadwal kuliah sering tidak disadari: dua mata kuliah pada jam yang sama, atau dua kelas menggunakan satu ruang. Benturan umumnya diketahui setelah perkuliahan berjalan.

## Poin Teknis

**Pendeteksian benturan.** Dua blok dinyatakan bertabrakan apabila berada pada hari yang sama dan rentang jamnya beririsan: `a.mulai < b.selesai && b.mulai < a.selesai`.

**Ruang turut diperiksa.** Benturan dilaporkan beserta nama ruang, tidak sekadar menandai adanya benturan.

**Total SKS otomatis.** Jumlah SKS dihitung dari mata kuliah yang aktif.

**Tata letak responsif.** Pada layar sempit, grid berubah menjadi agenda harian.

## Menjalankan

Berkas `index.html` dapat dibuka langsung pada peramban:

```bash
python3 -m http.server 8000
```

Tidak diperlukan dependensi maupun proses build. Seluruh proses berjalan pada peramban.

## Struktur Berkas

```
index.html    struktur halaman dan tampilan
app.js        seluruh logika: data, perhitungan, dan penyimpanan
styles.css    tata letak dan komponen antarmuka
tokens.css    warna, ukuran teks, dan spasi sebagai variabel
```

## Catatan

Data jadwal disimpan pada `localStorage`, sehingga tetap tersedia setelah halaman ditutup.

Dibangun menggunakan JavaScript, CSS Grid, dan HTML, tanpa kerangka kerja.
