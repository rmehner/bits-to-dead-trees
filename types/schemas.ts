import { BrowserContextOptions, Page } from "playwright-core";

export type PdfOptions = Parameters<Page["pdf"]>[0];
export type GotoOptions = Parameters<Page["goto"]>[1];
export type PdfRequestBody = {
  url: string;
  pdfOptions?: PdfOptions | null;
  gotoOptions?: GotoOptions | null;
  browserContextOptions?: BrowserContextOptions | null;
};
