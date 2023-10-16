---
"bits-to-dead-trees": minor
---

Allow to use `PORT` instead of `SERVER_PORT` as environment variable to set the listening port.

This is to be more in line with most hosting providers.
`PORT` takes precedence over `SERVER_PORT`. Default is 8000.
