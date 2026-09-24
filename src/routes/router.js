const express = require("express");
const path = require("path");
const quran = require("../controllers/quranController");
const doa = require("../controllers/doaController");
const dzikir = require("../controllers/dzikirController");
const hadits = require("../controllers/haditsController");
const router = express.Router();

// Health check (no caching, cheap, for load balancers/uptime monitors)
router.get("/health", (req, res) =>
  res.send({ status: "ok", uptime: Math.floor(process.uptime()), memory: process.memoryUsage() })
);

// Middleware for caching
router.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=86400, stale-while-revalidate"
  );
  next();
});

// Serve OpenAPI spec locally so docs never go stale (was raw.githubusercontent SatganzDevs fork)
router.get("/docs.json", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "docs.json"))
);

// API documentation endpoint (Scalar, lightweight Swagger UI replacement)
router.get("/", (req, res) =>
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Islamic API Documentation</title>
<meta name="description" content="Dokumentasi API untuk Quran, Doa, Dzikir, dan Hadits. Tersedia untuk digunakan dalam aplikasi WhatsApp Bot.">
<meta name="author" content="Islamic Dev Team">
<meta property="og:image" content="https://www.systemoflife.com/wp-content/uploads/2018/09/favicon.png">
<link rel="icon" type="image/x-icon" href="https://www.systemoflife.com/wp-content/uploads/2018/09/favicon.png">
<style>body{margin:0}</style>
</head>
<body>
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
<script>
Scalar.createApiReference('#app', {
  url: '/docs.json',
  title: 'Islamic API'
});
</script>
</body>
</html>`)
);

// Quran routes
router.get("/quran/surah", quran.getAllSurah);
router.get("/quran/surah/:surahId", quran.getSurah);
router.get("/quran/juz", quran.getAllJuz);
router.get("/quran/juz/:juzId", quran.getJuz);
router.get("/quran/ayah", quran.getAllAyah);
router.get("/quran/ayah/surah/:surahId", quran.getAyahSurah);
router.get("/quran/ayah/:surahId/:startId-:endId", quran.getAyahRange);
router.get("/quran/ayah/:surahId/:ayahId", quran.getAyah);
router.get("/quran/ayah/juz/:juzId", quran.getAyahJuz);
router.get("/quran/ayah/page/:pageId", quran.getAyahPage);
router.get("/quran/asbab", quran.getAllAsbab);
router.get("/quran/asbab/:id", quran.getAsbab);
router.get("/quran/asma", quran.getAsma);
router.get("/quran/tafsir", quran.getAllTafsir);
router.get("/quran/tafsir/:id", quran.getTafsir);
router.get("/quran/theme", quran.getAllTheme);
router.get("/quran/theme/:id", quran.getTheme);
router.get("/quran/word", quran.getAllWord);
router.get("/quran/word/:surahId/", quran.getWordSurah);
router.get("/quran/word/:surahId/:ayahId", quran.getWord);

// Doa routes
router.get("/doa", doa.getAllDoa);
router.get("/doa/:source", doa.getDoa);

// Dzikir routes
router.get("/dzikir/:source", dzikir.getDzikir);

// Hadits routes
router.get("/hadits", hadits.getAllHadits);
router.get("/hadits/:nomor", hadits.getHadits);

// Handle 404 for all other routes
router.all("*", (req, res) =>
  res.status(404).send({
    code: 404,
    status: "Not Found.",
    message: `Resource "${req.url}" is not found.`,
  })
);

// Centralized error handler (e.g. malformed JSON bodies)
router.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const code = err.status || err.statusCode || 500;
  res.status(code).send({
    code,
    status: code === 400 ? "Bad Request." : "Error.",
    message: code === 500 ? "Internal Server Error." : err.message,
  });
});

module.exports = router;
