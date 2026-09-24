const doa = require("../services/doaService");
const { notFound, sendData, paginate } = require("../utils/respond");

const VALID_SOURCES = ["quran", "hadits", "pilihan", "harian", "ibadah", "haji", "lainnya"];

const getAllDoa = (req, res) => {
  const result = paginate(req, res, doa.getAllDoa());
  if (!result) return;
  sendData(res, result.items, result.meta);
};

const getDoa = (req, res) => {
  const { source } = req.params;
  if (!VALID_SOURCES.includes(source)) {
    return notFound(res, `Doa source "${source}" is not found. Valid sources: ${VALID_SOURCES.join(", ")}.`);
  }
  sendData(res, doa.getDoa(source));
};

module.exports = {
  getAllDoa,
  getDoa,
};
