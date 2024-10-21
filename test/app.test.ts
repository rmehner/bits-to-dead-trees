import { chromium } from "playwright-core";
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from "vitest";

import build, {
  defaultBrowserContextOptions,
  defaultGotoOptions,
  // @ts-ignore
} from "../app.js";
const app = build();

describe("GET /health", () => {
  it("provides a simple health check", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toEqual(200);
  });
});

vi.mock("playwright-core", () => {
  const playwright = {
    chromium: {
      launch: vi.fn(),
    },
  };
  return playwright;
});

describe("POST /pdf", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  let gotoMethod = vi.fn();
  let pdf = vi.fn();
  let newPage = vi.fn();
  let newContext = vi.fn();
  let close = vi.fn();

  beforeEach(() => {
    gotoMethod = vi.fn().mockResolvedValue({
      ok() {
        return true;
      },
      status() {
        return 200;
      },
    });
    pdf = vi.fn().mockResolvedValue(Buffer.from("pdf"));
    newPage = vi.fn().mockResolvedValue({ goto: gotoMethod, pdf });
    newContext = vi.fn().mockResolvedValue({ newPage });

    (chromium.launch as Mock).mockResolvedValue({
      newContext,
      close,
    });
  });

  it("sends a buffer of the PDF as response", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: "/foobar" },
    });

    expect(gotoMethod).toHaveBeenCalledTimes(1);
    expect(gotoMethod).toHaveBeenLastCalledWith("/foobar", defaultGotoOptions);

    expect(response.statusCode).toEqual(200);
    expect(response.payload).toEqual("pdf");
  });

  it("allows to overwrite gotoOptions but merges them with the defaults", async () => {
    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: "/foobar", gotoOptions: { timeout: 300 } },
    });

    expect(gotoMethod).toHaveBeenCalledWith("/foobar", {
      timeout: 300,
      waitUntil: "networkidle",
    });
  });

  it("uses the default browserContextOptions if not passed or empty", async () => {
    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: "/foobar", browserContextOptions: {} },
    });

    expect(newContext).toHaveBeenCalledWith(defaultBrowserContextOptions);
  });

  it("allows to overwrite browserContextOptions", async () => {
    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "/foobar",
        browserContextOptions: { ignoreHTTPSErrors: false },
      },
    });

    expect(newContext).toHaveBeenCalledWith({
      ignoreHTTPSErrors: false,
    });
  });

  it("returns validation errors", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "/foobar",
        gotoOptions: { doesNot: "exist" },
      },
    });

    expect(response.statusCode).toEqual(400);

    const parsedResponse = JSON.parse(response.body);

    expect(parsedResponse.error).toBeTruthy();
    expect(parsedResponse.message).toContain("body/gotoOptions");
  });

  it("returns error if page could not load", async () => {
    gotoMethod.mockResolvedValue({
      ok() {
        return false;
      },

      status() {
        return 404;
      },

      statusText() {
        return "Not found";
      },

      async text() {
        return "We tried very hard, but could not find the page.";
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "/foobar",
      },
    });

    expect(response.statusCode).toEqual(404);
    const error = JSON.parse(response.body);

    expect(error).toMatchObject({
      error: true,
      status: 404,
      statusText: "Not found",
      message: "We tried very hard, but could not find the page.",
    });
  });

  it("allows to pass options to the pdf call", async () => {
    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "/foobar",
        pdfOptions: {
          headerTemplate: "moin",
        },
      },
    });

    expect(pdf).toHaveBeenCalledWith({ headerTemplate: "moin" });
  });

  it("returns 500 if something broke", async () => {
    pdf.mockRejectedValue(new Error("OH NO"));

    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "/foobar",
      },
    });

    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body)).toMatchObject({
      statusCode: 500,
      error: "Internal Server Error",
      message: "OH NO",
    });
  });

  it("allows null as empty for options", async () => {
    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: "/foobar", gotoOptions: null },
    });

    expect(gotoMethod).toHaveBeenCalledWith("/foobar", defaultGotoOptions);
  });

  it("closes the browser", async () => {
    pdf.mockRejectedValue("OH NO");

    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "/foobar",
      },
    });

    expect(close).toHaveBeenCalled();
  });

  it("generates the pdf before closing the browser", async () => {
    let i = 0;

    pdf.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 100));

      return i++;
    });

    close.mockImplementation(() => {
      return i++;
    });

    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "https://google.com",
      },
    });

    const callOrderForPdf = pdf.mock.invocationCallOrder[0];
    const callOrderForClose = close.mock.invocationCallOrder[0];

    expect(callOrderForPdf).toBeLessThan(callOrderForClose);
  });
});
