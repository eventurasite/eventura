# backend/Dockerfile
# Stage de build
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache bash libc6-compat openssl curl build-base

COPY package*.json ./
RUN npm ci

COPY . .
# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Stage final (produção)
FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache bash libc6-compat openssl curl

ENV NODE_ENV=production
# Copia apenas o necessário do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 5000
CMD ["node", "dist/server.js"]

