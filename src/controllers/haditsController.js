const hadits = require("../services/haditsService");
const { badRequest, notFound, sendData, parsePositiveInt, paginate } = require("../utils/respond");

const TOTAL_HADITS = 42;

const getAllHadits = (req, res) => {
  const result = paginate(req, res, hadits.getAllHadits());
  if (!result) return;
  sendData(res, result.items, result.meta);
};

const getHadits = (req, res) => {
  const nomor = parsePositiveInt(req.params.nomor);
  if (nomor === null) {
    badRequest(res, `Invalid hadits nomor "${req.params.nomor}". Must be an integer 1-${TOTAL_HADITS}.`);
    return;
  }
  const data = hadits.getHadits(nomor);
  if (!data.length) return notFound(res, `Hadits ${nomor} is not found. Valid range is 1-${TOTAL_HADITS}.`);
  sendData(res, data);
};

module.exports = {
  getAllHadits,
  getHadits,
};
