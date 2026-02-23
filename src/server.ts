import { Server } from "http";
import app from "./app.js";

const PORT = process.env.PORT ?? 3000;

const server: Server = app.listen(Number(PORT), () => {
  console.log(`Application is starting up. Would be available at port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
