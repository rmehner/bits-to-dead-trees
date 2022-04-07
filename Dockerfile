FROM mcr.microsoft.com/playwright:v1.20.2-focal

ENV NODE_ENV=production
ENV SERVER_PORT=8000
ENV SERVER_ADDRESS=0.0.0.0

WORKDIR /app

RUN apt-get update -yqq && \
    apt-get install -yqq --no-install-recommends tini && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

RUN npm install --production=false --ignore-scripts

COPY src src

RUN npm run build && \
  rm -Rf src && \
  npm install --production --ignore-scripts

ENTRYPOINT ["tini", "-v", "--"]
CMD ["node", "dist/index.js"]
