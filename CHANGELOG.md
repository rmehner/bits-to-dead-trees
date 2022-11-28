# bits-to-dead-trees

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
