FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY apps/backend/package.json ./apps/backend/

RUN npm install

COPY . .

WORKDIR /app/apps/backend

RUN npx medusa build


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/.medusa/server ./server

WORKDIR /app/server

RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 9000

CMD ["npm", "run", "start"]
