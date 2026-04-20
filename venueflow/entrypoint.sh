#!/bin/sh
set -e

# Run migrations
npx prisma db push --accept-data-loss

# Seed data
node prisma/seed.js

# Start the server
exec node server.mjs
