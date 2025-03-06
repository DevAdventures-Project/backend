FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable pnpm

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build
CMD ["pnpm", "prisma", "deploy", "&&", "pnpm", "start:prod"]


