// Smoke test: boots the API on a test port and asserts key behaviors.
// Run: npm test
const { fork } = require("child_process");
const http = require("http");
const assert = require("assert");

const PORT = 3210;
const BASE = `http://127.0.0.1:${PORT}`;

const get = (path) =>
  new Promise((resolve, reject) => {
    http.get(BASE + path, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on("error", reject);
  });

const json = (path) => get(path).then((r) => ({ ...r, data: JSON.parse(r.body) }));

const cases = [];
const test = (name, fn) => cases.push([name, fn]);

test("docs page serves Scalar, no swagger", async () => {
  const r = await get("/");
  assert.strictEqual(r.status, 200);
  assert.match(r.body, /scalar/i);
  assert.doesNotMatch(r.body, /swagger-ui-dist/);
});

test("docs.json is valid spec", async () => {
  const r = await json("/docs.json");
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.data.openapi, "3.0.0");
  assert.ok(Object.keys(r.data.paths).length >= 25);
});

test("surah list has 114", async () => {
  const r = await json("/quran/surah");
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.data.data.length, 114);
});

test("surah 999 -> 404, surah abc -> 400", async () => {
  assert.strictEqual((await get("/quran/surah/999")).status, 404);
  assert.strictEqual((await get("/quran/surah/abc")).status, 400);
});

test("ayah range + single still work", async () => {
  const range = await json("/quran/ayah/114/1-3");
  assert.strictEqual(range.data.data.length, 3);
  const single = await json("/quran/ayah/114/1");
  assert.strictEqual(single.data.data.length, 1);
  assert.strictEqual((await get("/quran/ayah/114/3-1")).status, 400);
  assert.strictEqual((await get("/quran/ayah/114/99")).status, 404);
});

test("juz bounds", async () => {
  assert.strictEqual((await get("/quran/juz/30")).status, 200);
  assert.strictEqual((await get("/quran/juz/31")).status, 404);
});

test("pagination on heavy endpoints", async () => {
  const r = await json("/quran/ayah?page=1&limit=2");
  assert.strictEqual(r.data.data.length, 2);
  assert.deepStrictEqual(r.data.meta, { page: 1, limit: 2, total: 6236 });
  assert.strictEqual((await get("/quran/tafsir?limit=9999")).status, 400);
  const legacy = await json("/quran/ayah");
  assert.strictEqual(legacy.data.data.length, 6236);
  assert.ok(!("meta" in legacy.data));
});

test("doa/dzikir/hadits validation", async () => {
  assert.strictEqual((await get("/doa/harian")).status, 200);
  assert.strictEqual((await get("/doa/ngawur")).status, 404);
  assert.strictEqual((await get("/dzikir/pagi")).status, 200);
  assert.strictEqual((await get("/dzikir/malam")).status, 404);
  assert.strictEqual((await get("/hadits/1")).status, 200);
  assert.strictEqual((await get("/hadits/43")).status, 404);
  assert.strictEqual((await get("/hadits/x")).status, 400);
});

test("word/tafsir/asbab/theme lookups", async () => {
  assert.strictEqual((await get("/quran/word/1/1")).status, 200);
  assert.strictEqual((await get("/quran/word/1/999")).status, 404);
  assert.strictEqual((await get("/quran/tafsir/1")).status, 200);
  assert.strictEqual((await get("/quran/asbab/1")).status, 200);
  assert.strictEqual((await get("/quran/theme/1")).status, 200);
  assert.strictEqual((await get("/quran/asma")).status, 200);
});

test("health + unknown route + headers", async () => {
  const h = await json("/health");
  assert.strictEqual(h.status, 200);
  assert.strictEqual(h.data.status, "ok");
  const nf = await get("/rute-ngawur");
  assert.strictEqual(nf.status, 404);
  const r = await get("/quran/surah");
  assert.ok(/max-age=0/.test(r.headers["cache-control"]));
  assert.strictEqual(r.headers["x-powered-by"], undefined);
  assert.strictEqual(r.headers["x-content-type-options"], "nosniff");
});

test("sholat kabkota list + search + detail", async () => {
  const all = await json("/sholat/kabkota/semua");
  assert.strictEqual(all.status, 200);
  assert.ok(all.data.data.length >= 40);
  assert.ok(all.data.data[0].id && all.data.data[0].lokasi);
  const q = await json("/sholat/kabkota?q=bandung");
  assert.strictEqual(q.status, 200);
  assert.ok(q.data.data.length >= 1);
  assert.ok(q.data.data[0].lokasi.includes("BANDUNG"));
  const one = await json("/sholat/kabkota/kota-bandung");
  assert.strictEqual(one.status, 200);
  assert.strictEqual(one.data.data.id, "kota-bandung");
  assert.strictEqual((await get("/sholat/kabkota/kota-ngawur")).status, 404);
});

test("sholat jadwal offline (today/date/coord) + validation", async () => {
  const today = await json("/sholat/jadwal/kota-jakarta-pusat/today");
  assert.strictEqual(today.status, 200);
  const keys = Object.keys(today.data.data.jadwal);
  assert.strictEqual(keys.length, 1);
  const j = today.data.data.jadwal[keys[0]];
  for (const k of ["imsak", "subuh", "terbit", "dhuha", "dzuhur", "ashar", "maghrib", "isya"]) {
    assert.match(j[k], /^\d{2}:\d{2}$/, k);
  }
  const dated = await json("/sholat/jadwal/kota-makassar/2026-01-01");
  assert.strictEqual(dated.status, 200);
  assert.ok(dated.data.data.jadwal["2026-01-01"]);
  assert.strictEqual((await get("/sholat/jadwal/kota-makassar/2026-13-99")).status, 400);
  assert.strictEqual((await get("/sholat/jadwal/kota-ngawur/today")).status, 404);
  const coord = await json("/sholat/jadwal?lat=-6.2&lng=106.85&tanggal=2026-01-01&tz=Asia/Jakarta");
  assert.strictEqual(coord.status, 200);
  assert.strictEqual(coord.data.data.jadwal.dzuhur.length, 5);
  assert.strictEqual((await get("/sholat/jadwal?lat=999&lng=106")).status, 400);
  assert.strictEqual((await get("/sholat/jadwal?lat=-6&lng=106&tz=Asia/Ngawur")).status, 400);
});

(async () => {
  const child = fork("index.js", { env: { ...process.env, PORT: String(PORT) }, silent: true });
  const ready = await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), 15000);
    child.stdout.on("data", (d) => {
      if (/Running at port/.test(d.toString())) {
        clearTimeout(timer);
        resolve(true);
      }
    });
    child.on("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
  if (!ready) {
    console.error("server did not boot");
    child.kill();
    process.exit(1);
  }
  let failed = 0;
  for (const [name, fn] of cases) {
    try {
      await fn();
      console.log(`ok - ${name}`);
    } catch (e) {
      failed++;
      console.error(`FAIL - ${name}: ${e.message}`);
    }
  }
  child.kill();
  console.log(failed ? `${failed} FAILED` : "all green");
  process.exit(failed ? 1 : 0);
})();
