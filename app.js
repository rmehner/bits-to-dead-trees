// @ts-check

import { fastify } from "fastify";
import { chromium } from "playwright-core";
import lodash from "lodash";
import { readFileSync } from "node:fs";

// we'd love to do this, but eslint doesn't like import assertions yet
// import PdfRequestBodySchema from "./pdf_request_body.json" assert { type: "json" };
const PdfRequestBodySchema = JSON.parse(
  readFileSync("./pdf_request_body.json", { encoding: "utf-8" })
);

const { isEmpty } = lodash;

/**
 * @typedef {Parameters<import("playwright-core").Page["pdf"]>[0]} PdfOptions
 * @typedef {Parameters<import("playwright-core").Page["goto"]>[1]} GotoOptions
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
 * @param {string} url
 * @param {PdfOptions} pdfOptions
 * @param {BrowserContextOptions} browserContextOptions
 * @param {GotoOptions} gotoOptions
 * @returns Buffer
 */
const createPDF = async (
  url,
  pdfOptions = {},
  browserContextOptions = {},
  gotoOptions = {}
) => {
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext(browserContextOptions);
    const page = await context.newPage();

    await page.goto(url, gotoOptions);

    const pdf = await page.pdf(pdfOptions);
    return pdf;
  } finally {
    await browser.close();
  }
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

      const pdfOpts = !isEmpty(pdfOptions) ? pdfOptions : {};
      const contextOpts = isEmpty(browserContextOptions)
        ? defaultBrowserContextOptions
        : browserContextOptions;
      const gotoOpts = isEmpty(gotoOptions) ? defaultGotoOptions : gotoOptions;

      try {
        return createPDF(url, pdfOpts, contextOpts, gotoOpts);
      } catch (error) {
        response.code(500);

        return {
          error,
        };
      }
    }
  );

  app.get("/health", async (_, response) => response.code(200).send());

  return app;
}

export default build;
