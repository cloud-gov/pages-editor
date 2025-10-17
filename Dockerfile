FROM node:22.12.0-bullseye

WORKDIR /app

# Install system dependencies for Sharp
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY ./package.json ./package-lock.json ./

# Install dependencies with optional dependencies
RUN npm install --include=optional --legacy-peer-deps

# Rebuild Sharp for the correct platform
RUN npm rebuild sharp

COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "dev"]
