const { CalculationMethod, Coordinates, PrayerTimes, Madhab } = require("adhan");
const db = require("../database/sholat");

const VALID_TZ = new Set(["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "Asia/Pontianak"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Kemenag-compatible: Fajr 20°, Isha 18° (= Singapore params), Shafi, imsak = subuh -10 mnt, dhuha = terbit +27 mnt.
function calcTimes(lat, lng, timezone, dateStr) {
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod.Singapore();
  params.madhab = Madhab.Shafi;
  // Patokan tengah hari UTC agar tanggal lokal Indonesia == dateStr (UTC+7..9)
  const date = new Date(`${dateStr}T12:00:00Z`);
  const t = new PrayerTimes(coords, date, params);
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
  const f = (d) => fmt.format(d);
  const shift = (d, min) => new Date(d.getTime() + min * 60000);

  return {
    imsak: f(shift(t.fajr, -10)),
    subuh: f(t.fajr),
    terbit: f(t.sunrise),
    dhuha: f(shift(t.sunrise, 27)),
    dzuhur: f(t.dhuhr),
    ashar: f(t.asr),
    maghrib: f(t.maghrib),
    isya: f(t.isha),
  };
}

function todayStrIn(tz) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function isValidDate(s) {
  if (!DATE_RE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(`${s}T12:00:00Z`);
  return dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === m && dt.getUTCDate() === d;
}

module.exports = { ...db, calcTimes, todayStrIn, isValidDate, VALID_TZ };
