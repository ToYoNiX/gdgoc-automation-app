import { processes } from "../store/processes.js";
import type { process_parameters } from "../common/types.js";

function progressItem(id: string, parameters: process_parameters): JSX.Element {
  const percent =
    parameters.length > 0
      ? Math.floor((parameters.downloaded / parameters.length) * 100)
      : 0;

  return (
    <div id={`process-${id}`}>
      {parameters.name} - {percent >= 100 ? "Complete" : `Progress: ${percent}%`}
    </div>
  );
}

export default function progress(): JSX.Element {
  return (
    <div
      id="progress"
      hx-get="/records/progress"
      hx-target="#progress"
      hx-trigger="every 2s"
      hx-swap="outerHTML"
    >
      {Array.from(processes.entries()).map(([id, values]) =>
        progressItem(id, values)
      )}
    </div>
  );
}