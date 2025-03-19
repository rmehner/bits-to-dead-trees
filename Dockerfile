FROM mcr.microsoft.com/playwright:v1.51.1

ENV NODE_ENV=production
ENV PORT=8000
ENV SERVER_ADDRESS=0.0.0.0

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev --ignore-scripts

COPY ["server.js", "app.js", "pdf_request_body.json", "./"]

CMD ["node", "server.js"]
