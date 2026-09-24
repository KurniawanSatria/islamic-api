const svc = require("../services/sholatService");
const { badRequest, notFound, sendData, paginate } = require("../utils/respond");

const DAY_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function resolveTz(queryTz, cityTz) {
  const tz = queryTz || cityTz;
  if (!svc.VALID_TZ.has(tz)) return null;
  return tz;
}

function buildJadwalPayload(kota, dateStr, tz) {
  const jadwal = svc.calcTimes(kota.lat, kota.lng, tz, dateStr);
  const d = new Date(`${dateStr}T12:00:00Z`);
  // Hari dalam tz target
  const weekday = new Intl.DateTimeFormat("id-ID", { timeZone: tz, weekday: "long" }).format(d);
  const [y, m, dd] = dateStr.split("-");
  return {
    id: kota.id,
    lokasi: kota.lokasi,
    provinsi: kota.provinsi,
    timezone: tz,
    tanggal: `${weekday}, ${dd}/${m}/${y}`,
    jadwal: { [dateStr]: { tanggal: `${weekday}, ${dd}/${m}/${y}`, ...jadwal } },
  };
}

// GET /sholat/kabkota/semua — kompat myquran (daftar id+lokasi)
const getAllKabkotaSemua = (req, res) => {
  sendData(res, svc.getAllKabkota().map(({ id, lokasi }) => ({ id, lokasi })));
};

// GET /sholat/kabkota?q=&page=&limit= — search + paginasi
const getKabkota = (req, res) => {
  const result = paginate(req, res, svc.searchKabkota(req.query.q));
  if (!result) return;
  if (result.meta) return sendData(res, result.items, result.meta);
  sendData(res, result.items);
};

// GET /sholat/kabkota/:id
const getKabkotaById = (req, res) => {
  const data = svc.getKabkotaById(req.params.id);
  if (!data) return notFound(res, `Kabkota "${req.params.id}" is not found.`);
  sendData(res, data);
};

// GET /sholat/jadwal/:id/today?tz= — kompat myquran
const getJadwalToday = (req, res) => {
  const kota = svc.getKabkotaById(req.params.id);
  if (!kota) return notFound(res, `Kabkota "${req.params.id}" is not found.`);
  const tz = resolveTz(req.query.tz, kota.timezone);
  if (!tz) return badRequest(res, `Invalid tz "${req.query.tz}". Valid: ${[...svc.VALID_TZ].join(", ")}.`);
  sendData(res, buildJadwalPayload(kota, svc.todayStrIn(tz), tz));
};

// GET /sholat/jadwal/:id/:date (YYYY-MM-DD) — kompat myquran
const getJadwalByDate = (req, res) => {
  const kota = svc.getKabkotaById(req.params.id);
  if (!kota) return notFound(res, `Kabkota "${req.params.id}" is not found.`);
  if (!svc.isValidDate(req.params.date)) {
    return badRequest(res, `Invalid date "${req.params.date}". Use YYYY-MM-DD.`);
  }
  const tz = resolveTz(req.query.tz, kota.timezone);
  if (!tz) return badRequest(res, `Invalid tz "${req.query.tz}". Valid: ${[...svc.VALID_TZ].join(", ")}.`);
  sendData(res, buildJadwalPayload(kota, req.params.date, tz));
};

// GET /sholat/jadwal?lat=&lng=&tanggal=&tz= — koordinat bebas (REST bersih)
const getJadwalByCoord = (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return badRequest(res, `Invalid lat "${req.query.lat}". Must be -90..90.`);
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return badRequest(res, `Invalid lng "${req.query.lng}". Must be -180..180.`);
  }
  const tz = req.query.tz || "Asia/Jakarta";
  if (!svc.VALID_TZ.has(tz)) {
    return badRequest(res, `Invalid tz "${req.query.tz}". Valid: ${[...svc.VALID_TZ].join(", ")}.`);
  }
  const dateStr = req.query.tanggal || svc.todayStrIn(tz);
  if (!svc.isValidDate(dateStr)) {
    return badRequest(res, `Invalid tanggal "${req.query.tanggal}". Use YYYY-MM-DD.`);
  }
  const jadwal = svc.calcTimes(lat, lng, tz, dateStr);
  sendData(res, { lat, lng, timezone: tz, tanggal: dateStr, jadwal });
};

module.exports = {
  getAllKabkotaSemua,
  getKabkota,
  getKabkotaById,
  getJadwalToday,
  getJadwalByDate,
  getJadwalByCoord,
  // legacy export agar test lama tidak pecah bila import parsial
  DAY_ID,
};
