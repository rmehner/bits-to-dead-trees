FROM mcr.microsoft.com/playwright:v1.23.4-focal

ENV NODE_ENV=production
ENV SERVER_PORT=8000
ENV SERVER_ADDRESS=0.0.0.0

WORKDIR /app

RUN apt-get update -yqq && \
    apt-get install -yqq --no-install-recommends tini && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev --ignore-scripts

COPY ["index.js", "pdf_request_body.json", "./"]

ENTRYPOINT ["tini", "-v", "--"]
CMD ["node", "index.js"]
