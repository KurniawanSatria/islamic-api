<div align="center">
  <h1 align="center">ISLAMIC API</h1>
  <p align="center">
    <strong>REST API Al-Quran Indonesia (Kemenag), Dzikir Harian, Kumpulan Doa, Hadits Arba'in.</strong>
  </p>
   <p align="center">
    <a href="https://islamic-api.vercel.app"><strong>Contoh</strong></a> · <a href="https://github.com/KurniawanSatria/islamic-api/issues"><strong>Laporkan Bug</strong></a> · <a href="https://github.com/KurniawanSatria/islamic-api/issues"><strong>Request Fitur</strong></a>
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
  <a href="https://github.com/KurniawanSatria/islamic-api/blob/main/LICENSE">
  <img alt="GitHub license" src="https://img.shields.io/github/license/KurniawanSatria/islamic-api">
  </a>
</div>



## Fitur
Rest Api ini menyediakan Al-Quran Indonesia, Kumpulan doa, Dzikir harian, dan Hadits arba'in. dari bebrapa sumber.

Fitur utama:
-  **Alquran** : Daftra Surah, daftar Juz, perhalaman, asbab nujul, asmaul husna, tafsir kemenag, kata per kata. [Quran Kemenag](https://quran.kemenag.go.id/)
-  **Doa-doa** : kumpulan doa-doa pilihan dari buku [Kumpulan doa sehari hari](https://jatim.kemenag.go.id/file/file/kumpulanbukuelektronik/pgdx1436850980.pdf)
-  **Dzikir** : Bacaan dzikir pagi, petang, dan sesudah solat.
-  **Hadits** : [Hadits Arba'in](https://haditsarbain.com/)
-  **Audio** : Audio murottal Shaykh Mishari Alafasy


## Penggunaan
|Endpoint|Contoh|Keterangan|
|----------|-----------|-----------|
|`/quran/surah`|[/quran/surah](https://islamic-api.vercel.app/quran/surah)|Daftar Surah|
|`/quran/surah/{surahId}`|[/quran/surah/114](https://islamic-api.vercel.app/quran/surah/114)|Informasi Surah|
|`/quran/juz`|[/quran/juz](https://islamic-api.vercel.app/quran/juz)|Daftar Juz|
|`/quran/juz/{juzId}`|[/quran/juz/30](https://islamic-api.vercel.app/quran/juz/30)|Informasi Juz|
|`/quran/ayah`|[/quran/ayah](https://islamic-api.vercel.app/quran/ayah)|Semua Ayat|
|`/quran/ayah/surah/{surahId}`|[/quran/ayah/surah/114](https://islamic-api.vercel.app/quran/ayah/surah/114)|Daftar Ayat berdasarkan Surah|
|`/quran/ayah/{surahId}/{ayahId}`|[/quran/ayah/114/1](https://islamic-api.vercel.app/quran/ayah/114/1)|Spesifik Ayat berdasarkan Surah|
|`/quran/ayah/{surahId}/{start}-{end}`|[/quran/ayah/114/1-3](https://islamic-api.vercel.app/quran/ayah/114/1-3)|Range Ayat berdasarkan Surah|
|`/quran/ayah/juz/{juzId}`|[/quran/ayah/juz/30](https://islamic-api.vercel.app/quran/ayah/juz/30)|Daftar Ayat berdasarkan Juz|
|`/quran/ayah/page/{pageId}`|[/quran/ayah/page/604](https://islamic-api.vercel.app/quran/ayah/page/604)|Daftar Ayat berdasarkan Halaman|
|`/quran/asbab`|[/quran/asbab](https://islamic-api.vercel.app/quran/asbab)|Daftar Asbab Nujul|
|`/quran/asbab/{id}`|[/quran/asbab/1](https://islamic-api.vercel.app/quran/asbab/1)|Spesifik Asbab Nujur|
|`/quran/asma`|[/quran/asma](https://islamic-api.vercel.app/quran/asma)|Daftar Asmaul Husna|
|`/quran/tafsir`|[/quran/tafsir](https://islamic-api.vercel.app/quran/tafsir)|Semua Tafsir|
|`/quran/tafsir/{id}`|[/quran/tafsir/1](https://islamic-api.vercel.app/quran/tafsir/1)|Tafsir berdasarkan Ayat|
|`/quran/theme`|[/quran/theme](https://islamic-api.vercel.app/quran/theme)|Semua Tema (Topik)|
|`/quran/theme/{id}`|[/quran/theme/1](https://islamic-api.vercel.app/quran/theme/1)|Spesifik topik|
|`/quran/word`|[/quran/word](https://islamic-api.vercel.app/quran/word)|Semua kata|
|`/quran/word/{surahId}`|[/quran/word/1](https://islamic-api.vercel.app/quran/word/1)|Semua Kata berdasarkan Surah|
|`/quran/word/{surahId}/{ayahId}`|[/quran/word/1/1](https://islamic-api.vercel.app/quran/word/1/1)|Semua Kata berdasarkan Spesifik Ayat dari Surah|
|`/doa`|[/doa](https://islamic-api.vercel.app/doa)|Kumpulan Doa||`/doa/{sumber}`|[/doa/harian](https://islamic-api.vercel.app/doa/harian)|Spesifik Kategori Doa (quran, hadits, pilihan, harian, ibadah, haji, lainnya)|
|`/dzikir/{sumber}`|[/dzikir/pagi](https://islamic-api.vercel.app/dzikir/pagi)|Dzikir Harian (pagi, sore, solat)|
|`/hadits`|[/hadits](https://islamic-api.vercel.app/hadits)|Daftar Hadits|
|`/hadits/{nomor}`|[/hadits/1](https://islamic-api.vercel.app/hadits/1)|Spesifik Hadits berdasarkan Nomor|
|`/sholat/kabkota/semua`|[/sholat/kabkota/semua](https://islamic-api.vercel.app/sholat/kabkota/semua)|Daftar kota (kompat myquran: id+lokasi)|
|`/sholat/kabkota?q=`|[/sholat/kabkota?q=bandung](https://islamic-api.vercel.app/sholat/kabkota?q=bandung)|Cari kota (support ?page=&limit=)|
|`/sholat/kabkota/{id}`|[/sholat/kabkota/kota-bandung](https://islamic-api.vercel.app/sholat/kabkota/kota-bandung)|Detail kota + lat/lng/timezone|
|`/sholat/jadwal/{id}/today`|[/sholat/jadwal/kota-jakarta-pusat/today](https://islamic-api.vercel.app/sholat/jadwal/kota-jakarta-pusat/today)|Jadwal hari ini (offline, Kemenag: Fajr 20°/Isya 18°)|
|`/sholat/jadwal/{id}/{date}`|[/sholat/jadwal/kota-makassar/2026-01-01](https://islamic-api.vercel.app/sholat/jadwal/kota-makassar/2026-01-01)|Jadwal per tanggal YYYY-MM-DD|
|`/sholat/jadwal?lat=&lng=`|[/sholat/jadwal?lat=-6.2&lng=106.85](https://islamic-api.vercel.app/sholat/jadwal?lat=-6.2&lng=106.85)|Jadwal koordinat bebas (+tanggal/tz)|

## Project
Contoh aplikasi saya menggunakan api ini.

[![Play Store](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=otang.app.muslim)

Dideploy ke

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)