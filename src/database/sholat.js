const kabkota = require("./json/kabkota.json");

const getAllKabkota = () => kabkota;

const getKabkotaById = (id) => {
  if (typeof id !== "string") return null;
  return kabkota.find((k) => k.id === id.toLowerCase()) || null;
};

const searchKabkota = (q) => {
  const norm = String(q || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!norm) return kabkota;
  return kabkota.filter((k) => k.lokasi.toLowerCase().includes(norm));
};

module.exports = { getAllKabkota, getKabkotaById, searchKabkota };
