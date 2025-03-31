FROM node:22.12.0-bullseye

WORKDIR /app

COPY package.json package-lock.json ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000
ENV PORT 3000
