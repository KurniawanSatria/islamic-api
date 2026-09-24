const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const router = require("./src/routes/router");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Docs page (/) loads Scalar from jsDelivr + one inline init script
        "script-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "connect-src": ["'self'", "https:"],
      },
    },
  })
);
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Basic request log (single line, no extra dependency)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// 100 req/min per IP across the whole API (docs page + spec excluded below)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => req.path === "/" || req.path === "/docs.json" || req.path === "/health",
});
app.use(apiLimiter);

app.use("/", router);

// Fallback error handler (malformed JSON, etc.)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const code = err.status || err.statusCode || 500;
  res.status(code).send({
    code,
    status: code === 400 ? "Bad Request." : "Error.",
    message: code === 500 ? "Internal Server Error." : err.message,
  });
});

// Only listen on direct run (node index.js). On Vercel serverless the
// exported app is invoked per-request instead.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("Running at port:", PORT);
  });
}

module.exports = app;