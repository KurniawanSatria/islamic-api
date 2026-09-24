<div align="center">
  <h1 align="center">Islamic API</h1>
  <p align="center">
    <strong>REST API Al-Qur'an Indonesia (Kemenag), Doa, Dzikir, Hadits Arba'in, dan Jadwal Sholat offline.</strong>
  </p>
  <p align="center">
    <a href="https://islamic-api.vercel.app"><strong>Docs & Demo</strong></a> ·
    <a href="https://github.com/KurniawanSatria/islamic-api/issues"><strong>Laporkan Bug</strong></a> ·
    <a href="https://github.com/KurniawanSatria/islamic-api/issues"><strong>Request Fitur</strong></a>
  </p>
  <a href="https://github.com/KurniawanSatria/islamic-api/graphs/contributors">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/KurniawanSatria/islamic-api">
  </a>
  <a href="https://github.com/KurniawanSatria/islamic-api/network/members">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/KurniawanSatria/islamic-api">
  </a>
  <a href="https://github.com/KurniawanSatria/islamic-api/stargazers">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/KurniawanSatria/islamic-api">
  </a>
  <a href="https://github.com/KurniawanSatria/islamic-api/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/KurniawanSatria/islamic-api">
  </a>
</div>

## Fitur

- **Al-Qur'an** — daftar Surah/Juz, ayat per surah/juz/halaman, range ayat, asbab nuzul, asmaul husna, tafsir Kemenag, tema, kata per kata. Sumber: [Quran Kemenag](https://quran.kemenag.go.id/)
- **Doa** — kumpulan doa pilihan per kategori (`quran`, `hadits`, `pilihan`, `harian`, `ibadah`, `haji`, `lainnya`)
- **Dzikir** — bacaan pagi, sore, dan sesudah sholat
- **Hadits** — Hadits Arba'in (42 hadits). Sumber: [haditsarbain.com](https://haditsarbain.com/)
- **Sholat (offline)** — jadwal sholat kalkulasi lokal, kompatibel Kemenag (Fajr 20° / Isya 18°), tanpa dependensi API pihak ketiga. 55 kab/kota bundled + query koordinat bebas.
- **Audio** — murottal Syaikh Mishary Alafasy (via data ayat)

## Mulai cepat

```sh
npm install
npm run dev      # nodemon index.js
npm start        # node index.js (PORT default 3000)
npm test         # smoke test, boot di port 3210
npm run docs     # regenerate src/docs.json dari scripts/gen-docs.py
```

Docs interaktif (Scalar): buka `/` saat server jalan, atau [demo Vercel](https://islamic-api.vercel.app). Spesifikasi OpenAPI mentah: `/docs.json`. Health check: `/health`.

## Format respons

Sukses:

```json
{ "data": [...] }
{ "data": {...}, "meta": { "page": 1, "limit": 20, "total": 6236 } }
```

Error:

```json
{ "code": 404, "status": "Not Found.", "message": "Surah 999 is not found." }
```

Aturan validasi umum:

- ID numerik path harus integer positif (`abc` → `400`, di luar rentang → `404`)
- Paginasi opsional: tanpa `?page=&limit=` respons legacy penuh; jika dipakai, `limit` maks 500 (`?limit=9999` → `400`)
- Semua respons API di-cache edge (`Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate`); `/`, `/docs.json`, `/health` dikecualikan dari rate limit (100 req/menit/IP)

## Endpoint

Base URL lokal: `http://localhost:3000`. Contoh di bawah memakai host demo.

### Qur'an

| Endpoint | Contoh | Keterangan |
|----------|--------|------------|
| `/quran/surah` | [/quran/surah](https://islamic-api.vercel.app/quran/surah) | Daftar 114 Surah |
| `/quran/surah/{surahId}` | [/quran/surah/114](https://islamic-api.vercel.app/quran/surah/114) | Info 1 Surah (1–114) |
| `/quran/juz` | [/quran/juz](https://islamic-api.vercel.app/quran/juz) | Daftar 30 Juz |
| `/quran/juz/{juzId}` | [/quran/juz/30](https://islamic-api.vercel.app/quran/juz/30) | Info 1 Juz (1–30) |
| `/quran/ayah` | [/quran/ayah?page=1&limit=2](https://islamic-api.vercel.app/quran/ayah?page=1&limit=2) | 6236 ayat, support paginasi |
| `/quran/ayah/surah/{surahId}` | [/quran/ayah/surah/114](https://islamic-api.vercel.app/quran/ayah/surah/114) | Ayat per Surah |
| `/quran/ayah/{surahId}/{ayahId}` | [/quran/ayah/114/1](https://islamic-api.vercel.app/quran/ayah/114/1) | 1 ayat spesifik |
| `/quran/ayah/{surahId}/{start}-{end}` | [/quran/ayah/114/1-3](https://islamic-api.vercel.app/quran/ayah/114/1-3) | Range ayat |
| `/quran/ayah/juz/{juzId}` | [/quran/ayah/juz/30](https://islamic-api.vercel.app/quran/ayah/juz/30) | Ayat per Juz |
| `/quran/ayah/page/{pageId}` | [/quran/ayah/page/604](https://islamic-api.vercel.app/quran/ayah/page/604) | Ayat per halaman mushaf (1–604) |
| `/quran/asbab` | [/quran/asbab](https://islamic-api.vercel.app/quran/asbab) | Daftar Asbab Nuzul |
| `/quran/asbab/{id}` | [/quran/asbab/1](https://islamic-api.vercel.app/quran/asbab/1) | 1 Asbab Nuzul |
| `/quran/asma` | [/quran/asma](https://islamic-api.vercel.app/quran/asma) | 99 Asmaul Husna |
| `/quran/tafsir` | [/quran/tafsir?page=1&limit=2](https://islamic-api.vercel.app/quran/tafsir?page=1&limit=2) | Tafsir, support paginasi |
| `/quran/tafsir/{id}` | [/quran/tafsir/1](https://islamic-api.vercel.app/quran/tafsir/1) | Tafsir per ayat |
| `/quran/theme` | [/quran/theme](https://islamic-api.vercel.app/quran/theme) | Daftar tema/topik |
| `/quran/theme/{id}` | [/quran/theme/1](https://islamic-api.vercel.app/quran/theme/1) | 1 tema |
| `/quran/word` | [/quran/word?page=1&limit=2](https://islamic-api.vercel.app/quran/word?page=1&limit=2) | Kata per kata, support paginasi |
| `/quran/word/{surahId}` | [/quran/word/1](https://islamic-api.vercel.app/quran/word/1) | Kata per Surah |
| `/quran/word/{surahId}/{ayahId}` | [/quran/word/1/1](https://islamic-api.vercel.app/quran/word/1/1) | Kata per ayat |

### Doa, Dzikir, Hadits

| Endpoint | Contoh | Keterangan |
|----------|--------|------------|
| `/doa` | [/doa](https://islamic-api.vercel.app/doa) | Kumpulan doa |
| `/doa/{source}` | [/doa/harian](https://islamic-api.vercel.app/doa/harian) | Kategori: `quran`, `hadits`, `pilihan`, `harian`, `ibadah`, `haji`, `lainnya` |
| `/dzikir/{source}` | [/dzikir/pagi](https://islamic-api.vercel.app/dzikir/pagi) | Set: `pagi`, `sore`, `solat` |
| `/hadits` | [/hadits](https://islamic-api.vercel.app/hadits) | 42 Hadits Arba'in |
| `/hadits/{nomor}` | [/hadits/1](https://islamic-api.vercel.app/hadits/1) | Hadits no 1–42 |

### Sholat (offline, tanpa upstream)

Metode: [adhan](https://www.npmjs.com/package/adhan) param Singapore (Fajr 20°, Isya 18°) + madhab Syafi'i — ekuivalen Kemenag. `imsak = subuh − 10 mnt`, `dhuha = terbit + 27 mnt`. Validasi vs myquran (Jakarta): selisih 1–3 mnt. Zona waktu valid: `Asia/Jakarta`, `Asia/Makassar`, `Asia/Jayapura`, `Asia/Pontianak` (default ikut kota).

| Endpoint | Contoh | Keterangan |
|----------|--------|------------|
| `/sholat/kabkota/semua` | [/sholat/kabkota/semua](https://islamic-api.vercel.app/sholat/kabkota/semua) | Daftar kota, bentuk kompat myquran (`id` + `lokasi`) |
| `/sholat/kabkota?q=` | [/sholat/kabkota?q=bandung](https://islamic-api.vercel.app/sholat/kabkota?q=bandung) | Cari kota, support `?page=&limit=` |
| `/sholat/kabkota/{id}` | [/sholat/kabkota/kota-bandung](https://islamic-api.vercel.app/sholat/kabkota/kota-bandung) | Detail kota + `lat`/`lng`/`timezone` |
| `/sholat/jadwal/{id}/today` | [/sholat/jadwal/kota-jakarta-pusat/today](https://islamic-api.vercel.app/sholat/jadwal/kota-jakarta-pusat/today) | Jadwal hari ini (`?tz=` opsional) |
| `/sholat/jadwal/{id}/{date}` | [/sholat/jadwal/kota-makassar/2026-01-01](https://islamic-api.vercel.app/sholat/jadwal/kota-makassar/2026-01-01) | Jadwal per tanggal `YYYY-MM-DD` |
| `/sholat/jadwal?lat=&lng=` | [/sholat/jadwal?lat=-6.2&lng=106.85](https://islamic-api.vercel.app/sholat/jadwal?lat=-6.2&lng=106.85) | Koordinat bebas (`tanggal`, `tz` opsional) |

Contoh respons jadwal:

```json
{
  "data": {
    "id": "kota-jakarta-pusat",
    "lokasi": "KOTA JAKARTA PUSAT",
    "provinsi": "DKI JAKARTA",
    "timezone": "Asia/Jakarta",
    "tanggal": "Jumat, 25/09/2026",
    "jadwal": {
      "2026-09-25": {
        "tanggal": "Jumat, 25/09/2026",
        "imsak": "04:14",
        "subuh": "04:24",
        "terbit": "05:41",
        "dhuha": "06:08",
        "dzuhur": "11:46",
        "ashar": "14:55",
        "maghrib": "17:49",
        "isya": "18:58"
      }
    }
  }
}
```

Contoh curl:

```sh
curl "http://localhost:3000/sholat/kabkota?q=makassar"
curl "http://localhost:3000/sholat/jadwal/kota-bandung/2026-01-01"
curl "http://localhost:3000/sholat/jadwal?lat=-5.15&lng=119.41&tz=Asia/Makassar"
```

## Struktur proyek

```text
index.js                 # express app (helmet, cors, compression, rate-limit, error handler)
vercel.json              # deploy serverless Vercel
src/routes/router.js     # semua route + Scalar docs + 404/error handler
src/controllers/         # validasi param -> service (quran, doa, dzikir, hadits, sholat)
src/services/            # logika bisnis (sholat: adhan + timezone)
src/database/            # akses JSON (quran, doa, dzikir, hadits, sholat)
src/database/json/       # dataset (ayah, tafsir, word, kabkota, ...)
src/docs.json            # OpenAPI 3.0, digenerate scripts/gen-docs.py
scripts/test.js           # smoke test (node scripts/test.js / npm test)
```

## Project

Contoh aplikasi yang memakai API ini:

[![Play Store](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=otang.app.muslim)

Dideploy ke

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
