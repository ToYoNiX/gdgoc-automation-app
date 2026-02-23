import type { Request, Response } from "express";
import { logger } from "../app.js";
import { getAuthUrl, handleCallback } from "../services/youtubeService.js";

export function redirectToGoogle(req: Request, res: Response) {
  try {
    const url = getAuthUrl();
    return res.redirect(url);
  } catch (err) {
    logger.error(`Failed to generate auth URL | ${err}`);
    return res.status(500).send("Failed to initialize YouTube auth");
  }
}

export async function handleGoogleCallback(req: Request, res: Response) {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    await handleCallback(code);
    logger.info("YouTube OAuth flow completed successfully");
    return res.redirect("/records");
  } catch (err) {
    logger.error(`Failed to handle Google callback | ${err}`);
    return res.status(500).send("Failed to complete YouTube authorization");
  }
}