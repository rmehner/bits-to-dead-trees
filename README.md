# bits-to-dead-trees

🖥 -> 🌲 -> 📄 -> 🖨

Exposes a web server with a single endpoint to take in a URL and create a PDF out
of that. It's using [Playwright](https://playwright.dev) in the background for this.

[![Depfu](https://badges.depfu.com/badges/74bd86ac2a33c6c6f6817cafc6419e84/overview.svg)](https://depfu.com/github/rmehner/bits-to-dead-trees?project_id=35056)

## Setup

### Requirements

1. Node 20+
2. npm

### Installation

1. `git checkout https://github.com/rmehner/bits-to-dead-trees`
2. `cd bits-to-dead-trees`
3. `npm install`
4. `npm start` to start the server. It'll listen to port 8000 on localhost by default.

### Development

- After updating the `playwright` dependency, you should run `npm run update-schemas` to make sure that
  the server knows about new PDF options
- Use `npm run start:dev` to start everything in dev mode with build watch and friends

## Server

The server exposes the `/pdf` endpoint that listens to a POST request and expects a JSON body:

```json
{
  "url": "https://your-target-url.com/site/you/want/a/pdf/of",
  "pdfOptions": {},
  "gotoOptions": {},
  "browserContextOptions": {}
}
```

- `pdfOptions` are the options for the `pdf` call in Playwright: https://playwright.dev/docs/api/class-page#page-pdf.
- `gotoOptions` are the options for the `goto` method in Playwright: https://playwright.dev/docs/api/class-page#page-goto
  - if you don't pass anything, we default to a timeout of 60000 and wait for `networkidle`
- `browserContextOptions` are the options for the browser context in Playwright: https://playwright.dev/docs/api/class-browser#browser-new-context
  - if you don't pass anything, we default to set `ignoreHTTPSErrors` to `true`

The response is the PDF file.

## Docker

Versions are automatically build as Docker images and are available on [GitHub's package registry](https://github.com/rmehner/bits-to-dead-trees/pkgs/container/bits-to-dead-trees)

If you want to use it internally with docker-compose, this should give you a good idea to start:

```yml
services:
  pdf:
    image: ghcr.io/rmehner/bits-to-dead-trees:v2.17.0
    ports:
      - 8000:8000
```
