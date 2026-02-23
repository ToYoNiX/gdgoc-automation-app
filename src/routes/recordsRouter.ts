import express from "express";
import { getIndex, getProgress, downloadVideo } from "../controllers/recordsController.js";
import { redirectToGoogle, handleGoogleCallback } from "../controllers/youtubeController.js";

const recordRouter = express.Router();

recordRouter.get("/", getIndex);
recordRouter.get("/progress", getProgress);
recordRouter.post("/download", downloadVideo);
recordRouter.get("/youtube/auth", redirectToGoogle);
recordRouter.get("/youtube/callback", handleGoogleCallback);

export default recordRouter;