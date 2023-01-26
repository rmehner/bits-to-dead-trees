import { chromium } from "playwright-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import build, {
  defaultBrowserContextOptions,
  defaultGotoOptions,
} from "../app";
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
    gotoMethod = vi.fn().mockReturnValue(null);
    pdf = vi.fn().mockReturnValue(Buffer.from("pdf"));
    newPage = vi.fn().mockReturnValue({ goto: gotoMethod, pdf });
    newContext = vi.fn().mockReturnValue({ newPage });
    close = vi.fn();

    chromium.launch.mockReturnValue({ newContext, close });
  });

  it("sends a buffer of the PDF as response", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: "/foobar" },
    });

    expect(gotoMethod).toHaveBeenCalledTimes(1);
    expect(gotoMethod.calls[0][0]).toEqual("/foobar");

    expect(response.statusCode).toEqual(200);
    expect(response.payload).toEqual("pdf");
  });

  it("uses the default gotoOptions if not passed or empty", async () => {
    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: "/foobar", gotoOptions: {} },
    });

    expect(gotoMethod).toHaveBeenCalledWith("/foobar", defaultGotoOptions);
  });

  it("allows to overwrite gotoOptions", async () => {
    await app.inject({
      method: "POST",
      url: "/pdf",
      payload: { url: "/foobar", gotoOptions: { timeout: 300 } },
    });

    expect(gotoMethod).toHaveBeenCalledWith("/foobar", { timeout: 300 });
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
    pdf.mockRejectedValue("OH NO");

    const response = await app.inject({
      method: "POST",
      url: "/pdf",
      payload: {
        url: "/foobar",
      },
    });

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual("OH NO");
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
});
