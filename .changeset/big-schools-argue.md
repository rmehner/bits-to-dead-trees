---
"bits-to-dead-trees": major
---

Allow more options for pdf, context and goto to be passed. Also working validations.

We allow way more options now to be given in the payload:

- `pdfOptions` are the options for the `pdf` call in Playwright: https://playwright.dev/docs/api/class-page#page-pdf.
- `gotoOptions` are the options for the `goto` method in Playwright: https://playwright.dev/docs/api/class-page#page-goto
  - if you don't pass anything, we default to a timeout of 60000 and wait for `networkidle`
- `browserContextOptions` are the options for the browser context in Playwright: https://playwright.dev/docs/api/class-browser#browser-new-context
  - if you don't pass anything, we default to set `ignoreHTTPSErrors` to `true`

We finally added tests too! ✌️

## Breaking Changes

- We don't allow `options` in the payload anymore. Those are `pdfOptions` now. To adapt your code, rename `options` to `pdfOptions` and you should be good to go.
  This change was needed to allow more options for other methods we're using (like `timeout` for `goto`).
- We have stricter validation now and don't allow unknown keys in the option objects now. Previously we've ignored them, but we've now opted to bail out with
  an validation error so the user gets notified on typos and such.
