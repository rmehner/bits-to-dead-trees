import app from "./app.js";
const SERVER_PORT = process.env["SERVER_PORT"] ?? 8000;
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
    await server.listen({ port: +SERVER_PORT, host: SERVER_ADDRESS });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
