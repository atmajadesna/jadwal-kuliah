/* jadwal-kuliah — grid mingguan + deteksi bentrok jam/ruang.
 * Semua jam disimpan sebagai menit sejak 00.00 supaya perbandingan bentrok
 * cukup aritmetika biasa, bukan parsing tanggal.
 */
(() => {
  "use strict";

  const STORE = "jadwal-kuliah.v1";
  const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const JAM_MULAI = 7;
  const JAM_SELESAI = 21;

  const el = (id) => document.getElementById(id);

  const bawaan = [
    { id: 1, mk: "Basis Data", ruang: "Lab 2", hari: 0, mulai: 480, selesai: 580, sks: 3 },
    { id: 2, mk: "Pemrograman Web", ruang: "Lab 1", hari: 1, mulai: 600, selesai: 700, sks: 3 },
    { id: 3, mk: "Manajemen Proyek TI", ruang: "R. 204", hari: 2, mulai: 780, selesai: 880, sks: 2 },
    { id: 4, mk: "Jaringan Komputer", ruang: "Lab 3", hari: 3, mulai: 480, selesai: 580, sks: 3 },
    { id: 5, mk: "Struktur Data", ruang: "R. 201", hari: 4, mulai: 540, selesai: 640, sks: 3 },
  ];

  let state = { kuliah: bawaan.slice() };
  let seq = 50;

  // ---------- util ----------
  function toMin(v) {
    const [h, m] = String(v || "0:0").split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  }
  function jam(mnt) {
    const h = Math.floor(mnt / 60);
    const m = mnt % 60;
    return `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function tinggiJam() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--jam-tinggi").trim();
    return parseFloat(v) || 56;
  }

  function simpan() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { /* abaikan */ }
  }
  function muat() {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.kuliah)) {
        state = parsed;
        // lanjutkan penomoran dari id tertinggi supaya tidak ada id kembar setelah reload
        seq = state.kuliah.reduce((n, k) => Math.max(n, Number(k.id) || 0), 50);
      }
    } catch { /* pakai bawaan */ }
  }

  // ---------- bentrok ----------
  function cariBentrok() {
    const hasil = [];
    const k = state.kuliah;
    for (let i = 0; i < k.length; i += 1) {
      for (let j = i + 1; j < k.length; j += 1) {
        const a = k[i];
        const b = k[j];
        if (a.hari !== b.hari) continue;
        const tabrak = a.mulai < b.selesai && b.mulai < a.selesai;
        if (!tabrak) continue;
        hasil.push({
          a, b,
          ruangSama: a.ruang && b.ruang && a.ruang.toLowerCase() === b.ruang.toLowerCase(),
        });
      }
    }
    return hasil;
  }

  // ---------- render ----------
  function render() {
    const bentrok = cariBentrok();
    const idBentrok = new Set();
    bentrok.forEach(({ a, b }) => { idBentrok.add(a.id); idBentrok.add(b.id); });

    const totalSks = state.kuliah.reduce((n, k) => n + (Number(k.sks) || 0), 0);
    el("stat-mk").textContent = String(state.kuliah.length);
    el("stat-sks").textContent = String(totalSks);
    el("stat-bentrok").textContent = String(bentrok.length);

    el("ringkas").textContent = state.kuliah.length
      ? `${state.kuliah.length} mata kuliah, ${totalSks} SKS. ${bentrok.length ? "Ada jadwal yang bertabrakan — periksa di bawah." : "Tidak ada jam yang bertabrakan."}`
      : "Belum ada mata kuliah. Tambahkan lewat formulir di samping.";

    // peringatan
    const kotak = el("bentrok");
    if (bentrok.length) {
      kotak.hidden = false;
      kotak.innerHTML = `<b>${bentrok.length} bentrok ditemukan</b><ul>` + bentrok.map(({ a, b, ruangSama }) =>
        `<li>${esc(a.mk)} (${HARI[a.hari]} ${jam(a.mulai)}–${jam(a.selesai)}) bertabrakan dengan ` +
        `${esc(b.mk)} (${HARI[b.hari]} ${jam(b.mulai)}–${jam(b.selesai)})${ruangSama ? " — ruang sama: " + esc(a.ruang) : ""}.</li>`
      ).join("") + "</ul>";
    } else {
      kotak.hidden = true;
      kotak.innerHTML = "";
    }

    // rail jam
    const px = tinggiJam();
    let rail = "";
    for (let j = JAM_MULAI; j <= JAM_SELESAI; j += 1) {
      rail += `<span class="rail__jam" style="top:${(j - JAM_MULAI) * px}px">${String(j).padStart(2, "0")}.00</span>`;
    }
    el("rail").innerHTML = rail;

    // kolom per hari
    const badan = el("badan");
    badan.querySelectorAll(".kolom").forEach((n) => n.remove());
    HARI.forEach((nama, hari) => {
      const kolom = document.createElement("div");
      kolom.className = "kolom";
      kolom.dataset.hari = String(hari);
      const isi = state.kuliah.filter((k) => k.hari === hari).sort((a, b) => a.mulai - b.mulai);
      kolom.innerHTML = isi.map((k) => {
        const atas = ((k.mulai - JAM_MULAI * 60) / 60) * px;
        const tinggi = Math.max(28, ((k.selesai - k.mulai) / 60) * px - 2);
        const bentrokKelas = idBentrok.has(k.id) ? " blok--bentrok" : "";
        return `<div class="blok${bentrokKelas}" style="top:${atas}px;height:${tinggi}px" title="${esc(k.mk)}">
          <span class="blok__mk">${esc(k.mk)}</span>
          <span class="blok__kecil">${jam(k.mulai)}–${jam(k.selesai)}${k.ruang ? " · " + esc(k.ruang) : ""}</span>
          <button type="button" class="blok__x" data-hapus="${k.id}" aria-label="Hapus ${esc(k.mk)}">×</button>
        </div>`;
      }).join("");
      badan.appendChild(kolom);
    });

    // agenda untuk layar sempit
    el("agenda").innerHTML = HARI.map((nama, hari) => {
      const isi = state.kuliah.filter((k) => k.hari === hari).sort((a, b) => a.mulai - b.mulai);
      if (!isi.length) return "";
      return `<div class="agenda__hari">
        <p class="agenda__nama">${nama}</p>
        ${isi.map((k) => `<div class="agenda__item">
          <span class="agenda__jam">${jam(k.mulai)}–${jam(k.selesai)}</span>
          <span><span class="agenda__mk">${esc(k.mk)}</span>
            <span class="agenda__ruang">${k.ruang ? " · " + esc(k.ruang) : ""}${idBentrok.has(k.id) ? " · bentrok" : ""}</span></span>
          <button type="button" class="agenda__x" data-hapus="${k.id}" aria-label="Hapus ${esc(k.mk)}">×</button>
        </div>`).join("")}
      </div>`;
    }).join("") || '<p class="agenda__kosong">Belum ada jadwal.</p>';

    simpan();
  }

  // ---------- form ----------
  function pesan(teks, state_) {
    const p = el("pesan");
    p.textContent = teks;
    if (state_) p.dataset.state = state_; else delete p.dataset.state;
  }

  el("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const mk = el("mk").value.trim();
    const ruang = el("ruang").value.trim();
    const hari = Number(el("hari").value);
    const mulai = toMin(el("mulai").value);
    const selesai = toMin(el("selesai").value);
    const sks = Number(el("sks").value) || 0;

    el("mk").removeAttribute("aria-invalid");

    if (mk.length < 2) {
      el("mk").setAttribute("aria-invalid", "true");
      el("mk").focus();
      pesan("Nama mata kuliah belum diisi.", "error");
      return;
    }
    if (selesai <= mulai) {
      pesan("Jam selesai harus setelah jam mulai.", "error");
      return;
    }
    if (mulai < JAM_MULAI * 60 || selesai > JAM_SELESAI * 60) {
      pesan(`Jadwal hanya bisa diisi antara ${JAM_MULAI}.00 dan ${JAM_SELESAI}.00.`, "error");
      return;
    }

    const baru = { id: ++seq, mk, ruang, hari, mulai, selesai, sks };
    const bentrokLama = state.kuliah.filter((k) =>
      k.hari === hari && k.mulai < selesai && mulai < k.selesai
    );

    state.kuliah.push(baru);
    render();

    if (bentrokLama.length) {
      pesan(`Tersimpan, tetapi bertabrakan dengan ${bentrokLama.map((k) => k.mk).join(", ")}.`, "error");
    } else {
      pesan(`${mk} masuk jadwal ${HARI[hari]} ${jam(mulai)}–${jam(selesai)}.`, "ok");
    }

    el("mk").value = "";
    el("ruang").value = "";
    el("mk").focus();
  });

  document.addEventListener("click", (e) => {
    const tombol = e.target.closest("[data-hapus]");
    if (!tombol) return;
    state.kuliah = state.kuliah.filter((k) => k.id !== Number(tombol.dataset.hapus));
    render();
    pesan("Jadwal dihapus.");
  });

  muat();
  render();
})();
