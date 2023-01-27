// @ts-check

import { fastify } from "fastify";
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";

// we'd love to do this, but eslint doesn't like import assertions yet
// import PdfRequestBodySchema from "./pdf_request_body.json" assert { type: "json" };
const PdfRequestBodySchema = JSON.parse(
  readFileSync("./pdf_request_body.json", { encoding: "utf-8" })
);

/**
 * @typedef {Parameters<import("playwright-core").Page["pdf"]>[0]} PdfOptions
 * @typedef {Parameters<import("playwright-core").Page["goto"]>[1]} GotoOptions
 * @typedef {import("playwright-core").Browser} Browser
 * @typedef {import("playwright-core").BrowserContextOptions} BrowserContextOptions
 */

/**
 * @typedef {Object} PdfRequestBody
 * @property {string} url
 * @property {PdfOptions} pdfOptions
 * @property {BrowserContextOptions} browserContextOptions
 * @property {GotoOptions} gotoOptions
 */

export const defaultBrowserContextOptions = /** @type {const} */ ({
  ignoreHTTPSErrors: true,
});
export const defaultGotoOptions = /** @type {const} */ ({
  timeout: 60000,
  waitUntil: "networkidle",
});

/**
 *
 * @param {Browser} browser
 * @param {string} url
 * @param {PdfOptions} pdfOptions
 * @param {BrowserContextOptions} browserContextOptions
 * @param {GotoOptions} gotoOptions
 * @returns Buffer
 */
const createPDF = async (
  browser,
  url,
  pdfOptions = {},
  browserContextOptions = {},
  gotoOptions = {}
) => {
  const context = await browser.newContext(browserContextOptions);
  const page = await context.newPage();

  const response = await page.goto(url, gotoOptions);
  if (response?.ok()) {
    return page.pdf(pdfOptions);
  }

  return Promise.reject({
    error: true,
    message: await response?.text(),
    status: response?.status(),
    statusText: response?.statusText(),
  });
};

/**
 *
 * @param {import("fastify").FastifyServerOptions} opts
 */
function build(opts = {}) {
  const fastifyOptions = {
    ...opts,
    ajv: {
      customOptions: {
        // we want validation errors if someone passes an unknown option
        removeAdditional: false,
        // Don't adhere to ajvs strict types, as our schema is auto generated anyway
        allowUnionTypes: true,
      },
    },
  };
  const app = fastify(fastifyOptions);

  app.post(
    "/pdf",
    { schema: { body: PdfRequestBodySchema }, attachValidation: true },
    /**
     *
     * @param {import('fastify').FastifyRequest<{Body: PdfRequestBody}>} request
     * @param {import('fastify').FastifyReply} response
     */
    async (request, response) => {
      if (request.validationError) {
        response.code(400);

        return {
          error: true,
          message: request.validationError.message,
        };
      }

      const { url, pdfOptions, browserContextOptions, gotoOptions } =
        request.body;

      const pdfOpts = { ...pdfOptions };

      const contextOpts = {
        ...defaultBrowserContextOptions,
        ...browserContextOptions,
      };

      const gotoOpts = {
        ...defaultGotoOptions,
        ...gotoOptions,
      };

      const browser = await chromium.launch();
      try {
        return await createPDF(browser, url, pdfOpts, contextOpts, gotoOpts);
      } catch (error) {
        // @ts-ignore
        response.code(error.status ?? 500);

        return error;
      } finally {
        browser.close();
      }
    }
  );

  app.get("/health", async (_, response) => response.code(200).send());

  return app;
}

export default build;
