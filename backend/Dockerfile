FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install

# Copy rest of backend code
COPY . .

EXPOSE 5000

# Run production start
CMD ["npm","start"]
