FROM node:20-slim AS base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Final stage
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/server.mjs ./server.mjs
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/entrypoint.sh ./entrypoint.sh
COPY --from=base /app/src ./src

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
