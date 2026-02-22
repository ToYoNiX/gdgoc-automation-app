import progress from "./progress.js";

export default function index(): JSX.Element {
  return (
    <div id="index">
      <form hx-post="/records/download" hx-target="#index" hx-swap="outerHTML">
        <input type="text" name="name" placeholder="Name" id="name" required />
        <input type="text" name="url" placeholder="URL" id="url" required />
        <button type="submit">Start Download</button>
      </form>
      {progress()}
    </div>
  );
}