FROM oven/bun as builder
LABEL stage=builder
WORKDIR /app
COPY . .
RUN bun install --production
RUN bun build --compile --minify --sourcemap --target=bun-linux-x64-modern ./src/index.ts --outfile app

FROM ubuntu:24.04 as runtime
WORKDIR /api

COPY --from=builder /app/app ./app

RUN chmod +x /api/app

EXPOSE 5000
CMD ["/api/app"]