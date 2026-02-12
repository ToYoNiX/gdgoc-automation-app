import type { process_parameters } from "../common/types.js";

export default function progress(id: string, parameters: process_parameters) {
  return (
    <div
      id={`process-${id}`}
      hx-get={`/records/progress/${id}`}
      hx-target={`#process-${id}`}
      hx-trigger="every 2s"
    >
      {parameters["name"]} - progress:{" "}
      {Math.floor((parameters["downloaded"] / parameters["length"]) * 100)}%
    </div>
  );
}
