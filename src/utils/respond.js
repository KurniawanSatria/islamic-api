const error = (res, code, message) => {
  const status = code === 400 ? "Bad Request." : code === 404 ? "Not Found." : "Error.";
  return res.status(code).send({ code, status, message });
};

const badRequest = (res, message) => error(res, 400, message);
const notFound = (res, message) => error(res, 404, message);

const sendData = (res, data, meta) => {
  if (meta) return res.send({ data, meta });
  return res.send({ data });
};

// Strict positive integer parsing for path params: "12" ok, "1-3"/"abc"/"3.5" rejected.
const parsePositiveInt = (value) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1 ? n : null;
};

// Optional ?page=&limit= pagination. Returns { items, meta } or null on bad input.
// No params -> returns full array with meta null (legacy behavior preserved).
const paginate = (req, res, array, maxLimit = 500, defaultLimit = 20) => {
  const { page, limit } = req.query;
  if (page === undefined && limit === undefined) return { items: array, meta: null };
  const pageNum = page === undefined ? 1 : Number(page);
  const limitNum = limit === undefined ? defaultLimit : Number(limit);
  if (!Number.isInteger(pageNum) || pageNum < 1 || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > maxLimit) {
    badRequest(res, `Invalid pagination. Use ?page>=1&limit=1-${maxLimit}.`);
    return null;
  }
  const total = array.length;
  const items = array.slice((pageNum - 1) * limitNum, pageNum * limitNum);
  return { items, meta: { page: pageNum, limit: limitNum, total } };
};

module.exports = { error, badRequest, notFound, sendData, parsePositiveInt, paginate };
