---
"bits-to-dead-trees": major
---

Remove TypeScript, use vanilla JS with JSDoc types.

This actually improves DX by not having that extra build step, while still having
good support in your IDE, since we still have the types as JSDoc.

This is the v1.0. This has been very stable and it's unlikely that the API will change
a lot. Nothing should break for users with this release.
