FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN corepack enable pnpm

RUN pnpm install

COPY . .

RUN prisma generate

RUN pnpm run build
CMD ["nest", "start"]


