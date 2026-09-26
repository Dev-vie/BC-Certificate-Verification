const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { errorHandler, notFoundHandler } = require("./middleware/error");

const app = express();

// Trust reverse proxy (e.g. Render, Heroku) so secure cookies and headers work
app.set("trust proxy", 1);

const rawOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const allowedOrigins = rawOrigins
  .filter(Boolean)
  .flatMap((url) => url.split(","))
  .map((url) => url.trim().replace(/\/+$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, "");
      const isLocalNetwork = /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin);
      let isVercelDomain = false;
      try {
        isVercelDomain = /\.vercel\.app$/.test(new URL(origin).hostname);
      } catch {}

      if (
        allowedOrigins.includes(cleanOrigin) ||
        isVercelDomain ||
        isLocalNetwork ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation"), false);
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "authentix_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const apiRoutes = require("./routes/index");
app.use("/api", apiRoutes);
app.use("/", apiRoutes);

app.get("/google0c6e0641599c8c88.html", (req, res) => {
  res.send("google-site-verification: google0c6e0641599c8c88.html");
});

app.get("/", (req, res) => {
  res.json({ message: "Authentix API is running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
