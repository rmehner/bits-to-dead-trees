# bits-to-dead-trees

## 2.0.0

### Major Changes

- b4ebed6: Allow more options for pdf, context and goto to be passed. Also working validations.

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

- 484b197: Return an error if page could not be loaded

  ## Breaking Changes

  Previously we've ignored if the page could not be loaded and tried to create a PDF anyway. However,
  this lead to PDFs with random error messages on them, instead of a proper error in logging or similar.

  To provide an better experience, we've opted to change this, so errors are caught earlier.

### Minor Changes

- c7e554e: Update to Playwright 1.30.0
- 8b2ed78: Merge passed options with default options

## 1.5.1

### Patch Changes

- fcfa9be: Update to Playwright 1.29.2

## 1.5.0

### Minor Changes

- aaef816: Update Playwright to 1.29.x

## 1.4.2

### Patch Changes

- 1a0f800: Upgrade Playwright to 1.28.1

## 1.4.1

### Patch Changes

- b56a29c: Update fastify to 4.10.2 to mitigate [security bug](https://github.com/fastify/fastify/security/advisories/GHSA-3fjj-p79j-c9hh)

## 1.4.0

### Minor Changes

- b91b9ca: Upgrade to Playwright 1.28.0

## 1.3.1

### Patch Changes

- 235d3b6: Update to Playwright 1.27.1

## 1.3.0

### Minor Changes

- 1d9b58f: Update to Playwright 1.27.0

## 1.2.1

### Patch Changes

- f9ebcf7: Update Playwright to 1.26.1

## 1.2.0

### Minor Changes

- 58d1ddc: Update to Playwright 1.26.0 (new major browser versions)

## 1.1.1

### Patch Changes

- e943b30: Update to Playwright 1.25.1

## 1.1.0

### Minor Changes

- aa60fb0: Upgrade to Ubuntu Jammy instead of Focal

### Patch Changes

- a8bd6fa: Update to Playwright 1.25.0 (new browser versions again!)

## 1.0.2

### Patch Changes

- 86a275d: Fix server crash due to missing schema
- 029ce39: Fix server crash due to pretty print on development

## 1.0.1

### Patch Changes

- cd71c2f: Update playwright to 1.23.2 (new browser versions)

## 1.0.0

### Major Changes

- eccf614: Remove TypeScript, use vanilla JS with JSDoc types.

  This actually improves DX by not having that extra build step, while still having
  good support in your IDE, since we still have the types as JSDoc.

  This is the v1.0. This has been very stable and it's unlikely that the API will change
  a lot. Nothing should break for users with this release.

### Patch Changes

- 7ef95e5: Update playwright to 1.21.1
- d651f7a: Update playwright to 1.21.0

## 0.0.11

### Patch Changes

- a3c12a4: Wait for network idle event before creating pdf

## 0.0.10

### Patch Changes

- df332b7: Go back to automatic release, but use PAT

## 0.0.9

### Patch Changes

- ddb70f5: Update eslint
- 5176013: Add CI setup

## 0.0.8

### Patch Changes

- 67dc4a4: Manual release process for now
- e37239b: Add repository to package.json

## 0.0.7

### Patch Changes

- e272ea9: 🤡

## 0.0.6

### Patch Changes

- 7a28fc8: Last attempt to fix the docker pipeline for today

## 0.0.5

### Patch Changes

- fae9c4e: Another try to get automatic Docker builds running
- ea597c1: More pipeline fixes (at least I hope so)
- c323966: Move docker build into own job

## 0.0.4

### Patch Changes

- b7574f0: Fix release pipeline for Docker image

## 0.0.3

### Patch Changes

- bcd03db: Add automatic publish of docker images

## 0.0.2

### Patch Changes

- 0bd2a32: Initial release 🚀
