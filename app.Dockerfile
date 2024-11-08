FROM oven/bun as builder
LABEL stage=builder

# Create a build directory
WORKDIR /build

# Copy the app source code
COPY . .

# Move to tha api directory
WORKDIR /build/api

# Install the dependencies
RUN bun i

# Move to the app directory
WORKDIR /build/app

# Install the dependencies
RUN bun i

ENV VITE_APP_NAME=Buzz's ISEN
ENV VITE_APP_URL=https://buzzer.clubs-isen.fr
ENV VITE_API_URL=https://buzzapi.clubs-isen.fr

# Build the app
RUN bun run build

FROM nginx:1.27 as runtime
WORKDIR /app

COPY --from=builder /build/app/dist /usr/share/nginx/html
COPY --from=builder /build/app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]