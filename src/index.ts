import fastify from "fastify";

const SERVER_PORT = process.env["SERVER_PORT"] ?? 8000;

const server = fastify();

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.listen(+SERVER_PORT, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
