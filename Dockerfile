# Use the official Node.js runtime as base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install system dependencies needed for systeminformation
RUN apk add --no-cache \
    util-linux \
    procps \
    coreutils

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S notionupdater -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R notionupdater:nodejs /app
USER notionupdater

# Command to run the application
CMD ["node", "index.js"]