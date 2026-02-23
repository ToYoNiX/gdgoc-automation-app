import { google } from "googleapis";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { logger } from "../app.js";

const TOKEN_PATH = join("credentials", "youtube_token.json");
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

function getCredentials() {
  const raw = process.env.YOUTUBE_CREDENTIALS;
  if (!raw) throw new Error("YOUTUBE_CREDENTIALS env variable is not set");
  return JSON.parse(raw);
}

function createOAuthClient() {
  const credentials = getCredentials();
  const { client_id, client_secret, redirect_uris } = credentials.web;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

export function isAuthenticated(): boolean {
  try {
    readFileSync(TOKEN_PATH, "utf-8");
    return true;
  } catch {
    return false;
  }
}

export function getAuthUrl(): string {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

export async function handleCallback(code: string): Promise<void> {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  mkdirSync("credentials", { recursive: true });
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  logger.info("YouTube token saved");
}

export async function getAuthenticatedClient() {
  const client = createOAuthClient();
  try {
    const token = readFileSync(TOKEN_PATH, "utf-8");
    client.setCredentials(JSON.parse(token));
    // automatically refreshes token when expired
    client.on("tokens", (tokens) => {
      writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      logger.info("YouTube token refreshed");
    });
    return client;
  } catch {
    throw new Error("No YouTube token found, OAuth flow required");
  }
}