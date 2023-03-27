import { describe, expect, it } from "vitest";

import build from "../app";
const app = build();

describe(
  "Smoke tests",
  () => {
    it("sends the PDF on the success case", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/pdf",
        payload: { url: "https://coding-robin.de" },
      });

      expect(response.payload.startsWith("%PDF")).toBeTruthy();
    });

    it("returns an error object when the page could not be loaded", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/pdf",
        payload: {
          url: "http://httpbin.org/status/404",
        },
      });

      expect(response.statusCode).toEqual(404);
      const error = JSON.parse(response.body);

      expect(error).toMatchObject({
        error: true,
        status: 404,
        statusText: "NOT FOUND",
        message: "",
      });
    });
  },
  { timeout: 10_000 }
);
