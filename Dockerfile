FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

COPY apps/backend/package.json ./apps/backend/

RUN npm install

# installing additional linux specific dependencies which get trashed when doing developement on a mac
RUN npm install --no-save --package-lock=false --include=optional @swc/core-linux-x64-gnu@1.16.1

COPY . .

WORKDIR /app/apps/backend

RUN npx medusa build


FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/.medusa/server ./server

WORKDIR /app/server

RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 9000

CMD ["npm", "run", "start"]
