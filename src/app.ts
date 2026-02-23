import "dotenv/config";
import express from "express";
import pino from "pino";
import session from "express-session";
import recordsRouter from "./routes/recordsRouter.js";
import { auth } from "./middleware/auth.js";
import { getLogin, postLogin, postLogout } from "./controllers/authController.js";

const app = express();

export const logger = pino();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: `${process.env.APP_USERNAME}${process.env.APP_PASSWORD}`,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.HTTPS === "true" },
}));

// public routes
app.get("/login", getLogin);
app.post("/login", postLogin);
app.post("/logout", postLogout);

// youtube oauth callback is public
app.get("/records/youtube/callback", (req, res, next) => next());

// everything else requires auth
app.use(auth);
app.use("/records", recordsRouter);

export default app;