# backend/Dockerfile
# Usando Node 22 Alpine (leve)
FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema para build do Prisma
RUN apk add --no-cache bash libc6-compat openssl curl

# Copiar package.json e package-lock.json primeiro para cache de build
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código fonte
COPY . .

# Gerar Prisma Client com binaryTargets correto
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Expor porta da aplicação
EXPOSE 5000

# Comando para rodar o backend
CMD ["node", "dist/server.js"]
