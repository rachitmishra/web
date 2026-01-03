FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .

ENV NEXT_TELEMETRY_DISABLED 1

CMD npm run dev
