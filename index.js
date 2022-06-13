// @ts-check

/**
 * @typedef {Parameters<import("playwright-core").Page["pdf"]>[0]} PdfOptions
 */

/**
 * @typedef {Object} PdfRequestBody
 * @property {string} url
 * @property {PdfOptions} options
 */

const { fastify } = require("fastify");
const playwright = require("playwright-core");
const PdfRequestBodySchema = require("./schemas/pdf_request_body.json");

const SERVER_PORT = process.env["SERVER_PORT"] ?? 8000;
const SERVER_ADDRESS = process.env["SERVER_ADDRESS"] ?? "localhost";

const server = fastify({
  logger: {
    prettyPrint:
      process.env["NODE_ENV"] !== "production"
        ? {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          }
        : false,
  },
});

/**
 *
 * @param {string} url
 * @param {PdfOptions} options
 * @returns Buffer
 */
const createPDF = async (url, options = {}) => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  await page.goto(url, { timeout: 60000 });
  await page.waitForLoadState("networkidle");

  const pdf = await page.pdf(options);
  await browser.close();

  return pdf;
};

server.post(
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

    try {
      return createPDF(request.body.url, request.body.options);
    } catch (error) {
      response.code(500);

      return {
        error,
      };
    }
  }
);

server.get("/health", async (_, response) => response.code(200).send());

const startServer = async () => {
  try {
    await server.listen({ port: +SERVER_PORT, host: SERVER_ADDRESS });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
