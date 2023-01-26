---
"bits-to-dead-trees": major
---

Return an error if page could not be loaded

## Breaking Changes

Previously we've ignored if the page could not be loaded and tried to create a PDF anyway. However,
this lead to PDFs with random error messages on them, instead of a proper error in logging or similar.

To provide an better experience, we've opted to change this, so errors are caught earlier.
