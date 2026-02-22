import type { Request, Response } from 'express';
import layout from "../views/layout.js";
import progress from "../views/progress.js";
import index from "../views/index.js";
import { logger } from "../app.js";
import { download } from "../services/recordsService.js";

export function getProgress(req: Request, res: Response) {
  return res.send(progress());
}

export function getIndex(req: Request, res: Response) {
  return res.send(layout("Records Dashboard", index()));
}

export async function downloadVideo(req: Request, res: Response) {
  const name: string = req.body.name?.trim();
  const url: string = req.body.url?.trim();

  if (!url || !name) {
    return res.status(400).send("Both name and url are required");
  }

  // basic url validation
  try {
    new URL(url);
  } catch {
    return res.status(400).send("Invalid URL provided");
  }

  // sanitize name to prevent path traversal
  const safeName = name.replace(/[^a-zA-Z0-9_\-]/g, "_");

  try {
    await download(safeName, url);
    return res.redirect("/records");
  } catch (err) {
    logger.error(`Failed to download ${safeName} from ${url} | ${err}`);
    return res.status(500).send("Download failed");
  }
}