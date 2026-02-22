import express from "express";
import { getIndex, getProgress, downloadVideo } from "../controllers/recordsController.js";

const recordRouter = express.Router();

recordRouter.get("/", getIndex);
recordRouter.get("/progress", getProgress);
recordRouter.post("/download", downloadVideo);

export default recordRouter;