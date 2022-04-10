# bits-to-dead-trees

🖥 -> 🌲 -> 📄 -> 🖨

Exposes a web server with a single endpoint to take in a URL and create a PDF out
of that. It's using [Playwright](https://playwright.dev) in the background for this.

## Setup

### Requirements

1. Node 16+
2. npm

### Installation

1. `git checkout https://github.com/rmehner/bits-to-dead-trees`
2. `cd bits-to-dead-trees`
3. `npm install`
4. `npm run build` to build the app
5. `npm start` to start the server. It'll listen to port 8000 on localhost by default.

### Development

- After updating the `playwright` dependency, you should run `npm run update-schemas` to make sure that
  the server knows about new PDF options
- Use `npm run start:dev` to start everything in dev mode with build watch and friends

## Server

The server exposes the `/pdf` endpoint that listens to a POST request and expects a JSON body:

```json
{
  "url": "https://your-target-url.com/site/you/want/a/pdf/of",
  "options": {}
}
```

`options` are the options Playwright knows about PDF: https://playwright.dev/docs/api/class-page#page-pdf. We pass them to Playwright directly, so please refer to their docs.

The response is the PDF file.