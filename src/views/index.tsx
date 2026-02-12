import { processes } from "../app.js";
import progress from "./progress.js";

export default function index() {
  return (
    <div id="index">
      <form hx-post="/records/download" hx-target="#index">
        <input type="text" name="name" placeholder="name" id="name" />
        <input type="text" name="url" placeholder="url" id="url" />
        <button type="submit">Start Download</button>
      </form>
      <div id="downloads">
        {Array.from(processes.entries()).map(([id, values]) =>
          progress(id, values),
        )}
      </div>
    </div>
  );
}
