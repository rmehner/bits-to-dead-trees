FROM mcr.microsoft.com/playwright:v1.46.1

ENV NODE_ENV=production
ENV PORT=8000
ENV SERVER_ADDRESS=0.0.0.0

WORKDIR /app

RUN apt-get update -yqq && \
    apt-get install -yqq --no-install-recommends tini && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev --ignore-scripts

COPY ["server.js", "app.js", "pdf_request_body.json", "./"]

ENTRYPOINT ["tini", "-v", "--"]
CMD ["node", "server.js"]
