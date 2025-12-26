# Use official Node.js Alpine image for small footprint
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --only=production

# Copy application source
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
