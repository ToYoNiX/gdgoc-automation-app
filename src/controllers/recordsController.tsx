import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { createWriteStream, mkdirSync } from "fs";
import { processes } from "../app.js";
import layout from "../views/layout.js";
import progress from "../views/progress.js";
import type { process_parameters } from "../common/types.js";
import { logger } from "../app.js";

export function getProgress(req: any, res: any) {
  const key = req.body.key;

  return progress(key);
}

export function index(req: any, res: any) {
  res.send(
    layout(
      "Records Dashboard",
      <div id="focus">
        <form
          hx-post="/records/download"
          hx-target="#focus"
          hx-swap="innerHTML"
        >
          <input type="text" name="name" placeholder="name" id="name" />
          <input type="text" name="url" placeholder="url" id="url" />
          <button type="submit">Start Download</button>
        </form>
        <div id="downloads">
          {Array.from(processes.entries()).map(([_, values]) =>
            progress(values),
          )}
        </div>
      </div>,
    ),
  );
}

export async function downloadVideo(req: any, res: any) {
  const name: string = req.body.name;
  const url: string = req.body.url;

  if (!url) {
    res.redirect("/records");
  }

  // Create the download folder
  mkdirSync("downloads", { recursive: true });

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
      timeout: 30_000,
    });

    const id: string = uuidv4();

    const filePath = join("downloads", `${name}.mp4`);
    const writer = createWriteStream(filePath);

    let parameters: process_parameters = {
      name: name,
      length: parseInt(response.headers["content-length"], 10),
      downloaded: 0,
    };

    processes.set(id, parameters);

    response.data.on("data", (chunk: Buffer) => {
      parameters["downloaded"] += chunk.length;
      processes.set(id, parameters);
    });

    logger.info(`${filePath} downloading started`);

    writer.on("finish", () => {
      logger.info(`${filePath} downloaded`);
    });

    writer.on("error", (err) => {
      logger.error(`${filePath} couldn't download | ${err}`);
    });

    response.data.pipe(writer);
    res.redirect("/records");
  } catch (err) {
    logger.error(`axois failed to download ${name} | ${err}`);
  }
}
