import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

let server;

const startServer = async () => {
  await connectDatabase();

  server = app.listen(env.PORT, () => {
    console.log(
      `Server is running in ${env.NODE_ENV} mode on http://localhost:${env.PORT} `,
    );
  });
};

const stopServer = async (signal) => {
  console.log(`${signal} received, Disconnecting server`);

  const forceShutdownTimer = setTimeout(() => {
    console.error(`disconnecting server took too long \n forcing shutdown`);
    process.exit(1);
  }, 10000);

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve();
        });
      });
    }
    await disconnectDatabase();
    clearTimeout(forceShutdownTimer);
    process.exit(0);
  } catch (error) {
    console.error("An error occcured while shutting down the server", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => stopServer("SIGINT"));
process.on("SIGTERM", () => stopServer("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection occured", reason);
  stopServer("unhandledRejection");
});
process.on("uncaughtException", () => {
  console.error("uncaught Exception occured");
  process.exit(1);
});


startServer().catch((err) => {
    console.error(`Application failed to start ${err}`)
    process.exit(1);
})