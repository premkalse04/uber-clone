# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5173

ENV NODE_ENV=production

CMD ["serve", "-s", "dist", "-l", "5173"]
