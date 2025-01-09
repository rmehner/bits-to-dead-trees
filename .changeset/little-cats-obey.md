---
"bits-to-dead-trees": minor
---

Removes tini from the Docker dependencies.

This reduces the image size by one layer and one dependency by handling the signals
ourselves. Fastify supports graceful shutdown, so it's pretty straightforward and
one thing less to keep in mind.
