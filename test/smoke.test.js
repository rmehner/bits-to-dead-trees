import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { createServer } from "node:http";

import build from "../app";
const app = build();

const startServer = async () => {
  const server = createServer((req, res) => {
    if (req.url.endsWith("success")) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html>
          <body>
            <h1>All local servers are beautiful</h1>
          </body>
        </html>
      `);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  return server;
};

describe("Smoke tests", { timeout: 10_000, retry: 3 }, () => {
  let server;
  let baseUrl = "";

  beforeAll(async () => {
    server = await startServer();
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(() => {
    server?.close();
  });

  it("sends the PDF on the success case", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: `${baseUrl}/success` },
    });

    expect(response.payload.startsWith("%PDF")).toBeTruthy();
  });

  it("returns an error object when the page could not be loaded", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: `${baseUrl}/404`,
      },
    });

    expect(response.statusCode).toEqual(404);
    const error = JSON.parse(response.body);

    expect(error).toMatchObject({
      error: true,
      status: 404,
      statusText: "Not Found",
      message: /^404 (Not Found)?$/,
    });
  });
});
