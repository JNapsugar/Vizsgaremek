# Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Run with serve
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build ./build
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard"]
