import app from "./app.js";
const PORT = process.env["PORT"] ?? process.env["SERVER_PORT"] ?? 8000;
const SERVER_ADDRESS = process.env["SERVER_ADDRESS"] ?? "localhost";

const server = app({
  logger: {
    transport:
      process.env["NODE_ENV"] !== "production"
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
});

const startServer = async () => {
  try {
    await server.listen({ port: +PORT, host: SERVER_ADDRESS });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
