FROM node:18-alpine

# Install tini for better process handling
RUN apk add --no-cache tini

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production --no-package-lock

# Copy app source
COPY . .

# Expose the port
EXPOSE 3001

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# Start the server
CMD ["node", "server.js"] 