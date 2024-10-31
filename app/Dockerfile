FROM oven/bun as builder
WORKDIR /app
COPY . .
RUN bun i

ENV VITE_API_URL=https://buzzapi.clubs-isen.fr

RUN bun run build

FROM nginx:1.27 as runtime
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]