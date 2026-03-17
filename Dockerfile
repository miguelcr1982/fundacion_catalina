FROM node:22-alpine AS build

ENV TZ="America/Costa_Rica"
RUN apk --no-cache --update add tzdata \
    && npm i -g serve pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod=false

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
