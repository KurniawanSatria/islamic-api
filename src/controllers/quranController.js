const quranService = require("../services/quranService");
const { badRequest, notFound, sendData, parsePositiveInt, paginate } = require("../utils/respond");

const TOTAL_SURAH = 114;
const TOTAL_JUZ = 30;
const TOTAL_PAGE = 604;

const requireSurah = (res, raw) => {
  const id = parsePositiveInt(raw);
  if (id === null) {
    badRequest(res, `Invalid surahId "${raw}". Must be an integer 1-${TOTAL_SURAH}.`);
    return null;
  }
  if (id > TOTAL_SURAH) {
    notFound(res, `Surah ${id} is not found. Valid range is 1-${TOTAL_SURAH}.`);
    return null;
  }
  return id;
};

const getAllSurah = (req, res) => {
  sendData(res, quranService.getAllSurah());
};

const getSurah = (req, res) => {
  const id = requireSurah(res, req.params.surahId);
  if (id === null) return;
  const data = quranService.getSurah(id);
  if (!data) return notFound(res, `Surah ${id} is not found.`);
  sendData(res, data);
};

const getAllJuz = (req, res) => {
  sendData(res, quranService.getAllJuz());
};

const getJuz = (req, res) => {
  const id = parsePositiveInt(req.params.juzId);
  if (id === null) {
    badRequest(res, `Invalid juzId "${req.params.juzId}". Must be an integer 1-${TOTAL_JUZ}.`);
    return;
  }
  const data = quranService.getJuz(id);
  if (!data) return notFound(res, `Juz ${id} is not found. Valid range is 1-${TOTAL_JUZ}.`);
  sendData(res, data);
};

const getAllAyah = (req, res) => {
  const result = paginate(req, res, quranService.getAllAyah());
  if (!result) return;
  sendData(res, result.items, result.meta);
};

const getAyahSurah = (req, res) => {
  const id = requireSurah(res, req.params.surahId);
  if (id === null) return;
  sendData(res, quranService.getAyahSurah(id));
};

const getAyah = (req, res) => {
  const surahId = requireSurah(res, req.params.surahId);
  if (surahId === null) return;
  const ayahId = parsePositiveInt(req.params.ayahId);
  if (ayahId === null) {
    badRequest(res, `Invalid ayahId "${req.params.ayahId}". Must be a positive integer.`);
    return;
  }
  const data = quranService.getAyah(surahId, ayahId);
  if (!data.length) return notFound(res, `Ayah ${ayahId} in Surah ${surahId} is not found.`);
  sendData(res, data);
};

const getAyahRange = (req, res) => {
  const surahId = requireSurah(res, req.params.surahId);
  if (surahId === null) return;
  const startId = parsePositiveInt(req.params.startId);
  const endId = parsePositiveInt(req.params.endId);
  if (startId === null || endId === null || startId > endId) {
    badRequest(res, `Invalid range "${req.params.startId}-${req.params.endId}". Use {start}-{end} with 1 <= start <= end.`);
    return;
  }
  const data = quranService.getAyahRange(surahId, startId, endId);
  if (!data.length) return notFound(res, `No ayahs in range ${startId}-${endId} of Surah ${surahId}.`);
  sendData(res, data);
};

const getAyahJuz = (req, res) => {
  const id = parsePositiveInt(req.params.juzId);
  if (id === null || id > TOTAL_JUZ) {
    return notFound(res, `Juz "${req.params.juzId}" is not found. Valid range is 1-${TOTAL_JUZ}.`);
  }
  sendData(res, quranService.getAyahJuz(id));
};

const getAyahPage = (req, res) => {
  const id = parsePositiveInt(req.params.pageId);
  if (id === null || id > TOTAL_PAGE) {
    return notFound(res, `Page "${req.params.pageId}" is not found. Valid range is 1-${TOTAL_PAGE}.`);
  }
  const data = quranService.getAyahPage(id);
  if (!data.length) return notFound(res, `Page ${id} has no ayahs.`);
  sendData(res, data);
};

const getAllAsbab = (req, res) => {
  sendData(res, quranService.getAllAsbab());
};

const getAsbab = (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    badRequest(res, `Invalid asbab id "${req.params.id}". Must be a positive integer.`);
    return;
  }
  const data = quranService.getAsbab(id);
  if (!data.length) return notFound(res, `Asbab Nuzul ${id} is not found.`);
  sendData(res, data);
};

const getAsma = (req, res) => {
  sendData(res, quranService.getAsma());
};

const getAllTafsir = (req, res) => {
  const result = paginate(req, res, quranService.getAllTafsir());
  if (!result) return;
  sendData(res, result.items, result.meta);
};

const getTafsir = (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    badRequest(res, `Invalid tafsir id "${req.params.id}". Must be a positive integer.`);
    return;
  }
  const data = quranService.getTafsir(id);
  if (!data.length) return notFound(res, `Tafsir ${id} is not found.`);
  sendData(res, data);
};

const getAllTheme = (req, res) => {
  sendData(res, quranService.getAllTheme());
};

const getTheme = (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    badRequest(res, `Invalid theme id "${req.params.id}". Must be a positive integer.`);
    return;
  }
  const data = quranService.getTheme(id);
  if (!data.length) return notFound(res, `Theme ${id} is not found.`);
  sendData(res, data);
};

const getAllWord = (req, res) => {
  const result = paginate(req, res, quranService.getAllWord());
  if (!result) return;
  sendData(res, result.items, result.meta);
};

const getWordSurah = (req, res) => {
  const id = requireSurah(res, req.params.surahId);
  if (id === null) return;
  const data = quranService.getWordSurah(id);
  if (!data.length) return notFound(res, `No words found for Surah ${id}.`);
  sendData(res, data);
};

const getWord = (req, res) => {
  const surahId = requireSurah(res, req.params.surahId);
  if (surahId === null) return;
  const ayahId = parsePositiveInt(req.params.ayahId);
  if (ayahId === null) {
    badRequest(res, `Invalid ayahId "${req.params.ayahId}". Must be a positive integer.`);
    return;
  }
  const data = quranService.getWord(surahId, ayahId);
  if (!data.length) return notFound(res, `No words found for Ayah ${ayahId} in Surah ${surahId}.`);
  sendData(res, data);
};

module.exports = {
  getAllSurah,
  getSurah,
  getAllJuz,
  getJuz,
  getAyahSurah,
  getAyah,
  getAyahRange,
  getAyahJuz,
  getAllAyah,
  getAyahPage,
  getAllAsbab,
  getAsbab,
  getAsma,
  getAllTafsir,
  getTafsir,
  getAllTheme,
  getTheme,
  getAllWord,
  getWordSurah,
  getWord,
};
