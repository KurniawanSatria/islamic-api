const dzikir = require("../services/dzikirService");
const { notFound, sendData } = require("../utils/respond");

const VALID_SOURCES = ["pagi", "sore", "solat"];

const getDzikir = (req, res) => {
  const { source } = req.params;
  if (!VALID_SOURCES.includes(source)) {
    return notFound(res, `Dzikir source "${source}" is not found. Valid sources: ${VALID_SOURCES.join(", ")}.`);
  }
  sendData(res, dzikir.getDzikir(source));
};

module.exports = {
  getDzikir,
};
