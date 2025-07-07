# ------------------------
# Stage 1: Build the app
# ------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build  # Creates /app/build/index.js

# ------------------------
# Stage 2: Run the app
# ------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build folder from builder
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 6000

# Run the server by specifying the actual JS file
CMD ["node", "build/index.js"]
