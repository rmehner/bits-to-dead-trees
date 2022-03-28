import { Page } from "playwright-core";

export type PdfOptions = Parameters<Page["pdf"]>[0];
export type PdfRequestBody = {
  url: string;
  options?: PdfOptions;
};
