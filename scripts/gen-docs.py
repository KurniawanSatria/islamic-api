"""Regenerate src/docs.json so Scalar docs never drift from the routes.
Run: python3 scripts/gen-docs.py
"""
import json
from pathlib import Path

BASE_RESPONSES = {
    "400": {
        "description": "Bad request (malformed parameter)",
        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
    },
    "404": {
        "description": "Not found",
        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
    },
}

PAGINATION_PARAMS = [
    {"name": "page", "in": "query", "description": "Page number (1-based). Omit both for full legacy response.",
     "required": False, "schema": {"type": "integer", "minimum": 1, "default": 1}},
    {"name": "limit", "in": "query", "description": "Items per page (1-500, default 20). Omit both for full legacy response.",
     "required": False, "schema": {"type": "integer", "minimum": 1, "maximum": 500, "default": 20}},
]


def ok(summary, operation_id, description="Successful response", params=None, extra_responses=None):
    op = {
        "tags": ["__TAG__"],
        "summary": summary,
        "operationId": operation_id,
        "responses": {
            "200": {
                "description": description,
                "content": {"application/json": {"schema": {"type": "object"}}},
            },
        },
    }
    if params:
        op["parameters"] = params
    if extra_responses:
        op["responses"].update(extra_responses)
    return op


def path_param(name, desc, type_="integer"):
    return {"name": name, "in": "path", "description": desc, "required": True,
            "schema": {"type": type_}}


def enum_param(name, desc, values):
    return {"name": name, "in": "path", "description": desc, "required": True,
            "schema": {"type": "string", "enum": values}}


ROUTES = [
    ("quran", "/quran/surah", "List all Surah", "getAllSurah", "114 Surah"),
    ("quran", "/quran/surah/{surahId}", "Surah info", "getSurah", "Single Surah",
     [path_param("surahId", "Surah number 1-114")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/juz", "List all Juz", "getAllJuz", "30 Juz"),
    ("quran", "/quran/juz/{juzId}", "Juz info", "getJuz", "Single Juz",
     [path_param("juzId", "Juz number 1-30")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/ayah", "All ayahs (paginable)", "getAllAyah", "6236 ayahs, use ?page=&limit=",
     PAGINATION_PARAMS, {"400": BASE_RESPONSES["400"]}),
    ("quran", "/quran/ayah/surah/{surahId}", "Ayahs by Surah", "getAyahSurah", "All ayahs of a Surah",
     [path_param("surahId", "Surah number 1-114")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/ayah/{surahId}/{startId}-{endId}", "Ayah range", "getAyahRange", "e.g. /quran/ayah/114/1-3",
     [path_param("surahId", "Surah number 1-114"), path_param("startId", "Start ayah (>=1)"),
      path_param("endId", "End ayah (>= start)")],
     {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/ayah/{surahId}/{ayahId}", "Single ayah", "getAyah", "e.g. /quran/ayah/114/1",
     [path_param("surahId", "Surah number 1-114"), path_param("ayahId", "Ayah number")],
     {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/ayah/juz/{juzId}", "Ayahs by Juz", "getAyahJuz", "All ayahs of a Juz",
     [path_param("juzId", "Juz number 1-30")], {"404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/ayah/page/{pageId}", "Ayahs by Mushaf page", "getAyahPage", "Page 1-604",
     [path_param("pageId", "Mushaf page 1-604")], {"404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/asbab", "List Asbab Nuzul", "getAllAsbab", "All Asbab Nuzul entries"),
    ("quran", "/quran/asbab/{id}", "Single Asbab Nuzul", "getAsbab", "Asbab Nuzul by id",
     [path_param("id", "Asbab id")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/asma", "Asmaul Husna", "getAsma", "99 names of Allah"),
    ("quran", "/quran/tafsir", "All tafsir (paginable)", "getAllTafsir", "Large dataset, use ?page=&limit=",
     PAGINATION_PARAMS, {"400": BASE_RESPONSES["400"]}),
    ("quran", "/quran/tafsir/{id}", "Tafsir by ayah id", "getTafsir", "Kemenag tafsir for one ayah",
     [path_param("id", "Ayah id")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/theme", "All themes", "getAllTheme", "Quranic topics"),
    ("quran", "/quran/theme/{id}", "Single theme", "getTheme", "Topic by id",
     [path_param("id", "Theme id")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/word", "All words (paginable)", "getAllWord", "Word-by-word, large dataset",
     PAGINATION_PARAMS, {"400": BASE_RESPONSES["400"]}),
    ("quran", "/quran/word/{surahId}", "Words by Surah", "getWordSurah", "All words of a Surah",
     [path_param("surahId", "Surah number 1-114")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("quran", "/quran/word/{surahId}/{ayahId}", "Words by ayah", "getWord", "Word-by-word of one ayah",
     [path_param("surahId", "Surah number 1-114"), path_param("ayahId", "Ayah number")],
     {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("doa", "/doa", "All doa (paginable)", "getAllDoa", "Full doa collection",
     PAGINATION_PARAMS, {"400": BASE_RESPONSES["400"]}),
    ("doa", "/doa/{source}", "Doa by category", "getDoa", "One category of doa",
     [enum_param("source", "Doa category",
                ["quran", "hadits", "pilihan", "harian", "ibadah", "haji", "lainnya"])],
     {"404": BASE_RESPONSES["404"]}),
    ("dzikir", "/dzikir/{source}", "Dzikir", "getDzikir", "Morning/evening/after-prayer dzikir",
     [enum_param("source", "Dzikir set", ["pagi", "sore", "solat"])], {"404": BASE_RESPONSES["404"]}),
    ("hadits", "/hadits", "All Hadits Arba'in (paginable)", "getAllHadits", "42 hadits",
     PAGINATION_PARAMS, {"400": BASE_RESPONSES["400"]}),
    ("hadits", "/hadits/{nomor}", "Single hadits", "getHadits", "Hadits by number 1-42",
     [path_param("nomor", "Hadits number 1-42")], {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
    ("sholat", "/sholat/kabkota/semua", "All cities (myquran-compat)", "getAllKabkotaSemua", "id+lokasi list for dropdowns"),
    ("sholat", "/sholat/kabkota", "Search cities", "getKabkota", "Filter with ?q=&page=&limit=",
     PAGINATION_PARAMS, {"400": BASE_RESPONSES["400"]}),
    ("sholat", "/sholat/kabkota/{id}", "Single city", "getKabkotaById", "City with lat/lng/timezone",
     [{"name": "id", "in": "path", "description": "City slug, e.g. kota-bandung", "required": True, "schema": {"type": "string"}}],
     {"404": BASE_RESPONSES["404"]}),
    ("sholat", "/sholat/jadwal", "Prayer times by coordinate", "getJadwalByCoord", "Offline calc: ?lat=&lng=&tanggal=&tz=",
     [{"name": "lat", "in": "query", "description": "Latitude -90..90", "required": True, "schema": {"type": "number"}},
      {"name": "lng", "in": "query", "description": "Longitude -180..180", "required": True, "schema": {"type": "number"}},
      {"name": "tanggal", "in": "query", "description": "YYYY-MM-DD, default today in tz", "required": False, "schema": {"type": "string"}},
      {"name": "tz", "in": "query", "description": "Asia/Jakarta|Asia/Makassar|Asia/Jayapura|Asia/Pontianak", "required": False, "schema": {"type": "string"}}],
     {"400": BASE_RESPONSES["400"]}),
    ("sholat", "/sholat/jadwal/{id}/today", "Today's prayer times", "getJadwalToday", "Myquran-compat shape",
     [{"name": "id", "in": "path", "description": "City slug", "required": True, "schema": {"type": "string"}},
      {"name": "tz", "in": "query", "description": "Override city timezone", "required": False, "schema": {"type": "string"}}],
     {"404": BASE_RESPONSES["404"]}),
    ("sholat", "/sholat/jadwal/{id}/{date}", "Prayer times by date", "getJadwalByDate", "Date as YYYY-MM-DD",
     [{"name": "id", "in": "path", "description": "City slug", "required": True, "schema": {"type": "string"}},
      {"name": "date", "in": "path", "description": "YYYY-MM-DD", "required": True, "schema": {"type": "string"}}],
     {"400": BASE_RESPONSES["400"], "404": BASE_RESPONSES["404"]}),
]

paths = {}
for route in ROUTES:
    tag, path, summary, op_id, desc = route[:5]
    params = route[5] if len(route) > 5 else None
    extra = route[6] if len(route) > 6 else None
    operation = ok(summary, op_id, desc, params, extra)
    operation["tags"] = [tag]
    paths[path] = {"get": operation}

paths["/health"] = {"get": {**ok("Health check", "getHealth", "Uptime + memory, never cached"),
                            "tags": ["system"]}}
paths["/docs.json"] = {"get": {**ok("OpenAPI spec", "getSpec", "This OpenAPI document as JSON"),
                               "tags": ["system"]}}

spec = {
    "openapi": "3.0.0",
    "info": {
        "title": "Islamic API",
        "description": "REST API Al-Quran Indonesia (Kemenag), Dzikir Harian, Kumpulan Doa, Hadits Arba'in.",
        "contact": {"email": "satganzdevs@gmail.com"},
        "license": {"name": "Apache 2.0", "url": "http://www.apache.org/licenses/LICENSE-2.0.html"},
        "version": "1.1.0",
    },
    "servers": [
        {"url": "https://islamic-api.vercel.app", "description": "Production"},
    ],
    "tags": [
        {"name": "quran", "description": "Quran-related operations"},
        {"name": "doa", "description": "Doa-related operations"},
        {"name": "dzikir", "description": "Dzikir-related operations"},
        {"name": "hadits", "description": "Hadits-related operations"},
        {"name": "sholat", "description": "Prayer times (offline, Kemenag-compatible)"},
        {"name": "system", "description": "Health and spec"},
    ],
    "paths": paths,
    "components": {
        "schemas": {
            "Error": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 404},
                    "status": {"type": "string", "example": "Not Found."},
                    "message": {"type": "string", "example": 'Surah 999 is not found.'},
                },
            }
        }
    },
}

out = Path(__file__).resolve().parent.parent / "src" / "docs.json"
out.write_text(json.dumps(spec, indent=2, ensure_ascii=False) + "\n")
print(f"wrote {out} with {len(paths)} paths")
