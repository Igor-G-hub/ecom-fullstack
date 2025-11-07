FROM node:20-slim AS base
WORKDIR /app

# Install OpenSSL libraries, PostgreSQL client, netcat, and iputils-ping for connection testing
RUN apt-get update && apt-get install -y openssl postgresql-client netcat-openbsd iputils-ping && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

# Generate Prisma client and build
# DATABASE_URL is needed during build for Prisma schema validation
# Use a placeholder value if not provided (actual connection happens at runtime)
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres?schema=public"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "echo 'Running migrations (with retry)...' && for i in 1 2 3 4 5; do if npx prisma migrate deploy; then echo 'Migrations successful!'; break; else echo \"Migration attempt $i failed, retrying...\"; sleep 3; fi; done && echo 'Starting Next.js app...' && npm run start"]


