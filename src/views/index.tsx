import { isAuthenticated } from "../services/youtubeService.js";
import progress from "./progress.js";

export default function index(): JSX.Element {
  const authenticated = isAuthenticated();
  return (
    <div id="index">
      <form hx-post="/records/download" hx-target="#index" hx-swap="outerHTML">
        <input type="text" name="name" placeholder="Name" id="name" required />
        <input type="text" name="url" placeholder="URL" id="url" required />
        <button type="submit">Start Download</button>
      </form>
      <div>
        {authenticated ? (
          <span>✓ YouTube connected</span>
        ) : (
          <a href="/records/youtube/auth">Connect YouTube</a>
        )}
      </div>
      {progress()}
    </div>
  );
}