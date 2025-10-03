FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code and mocks
COPY src/ ./src
COPY mocks/ ./mocks

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "src/app.js"]