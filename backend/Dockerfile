FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production --no-package-lock

# Copy app source
COPY . .

# Expose the port
EXPOSE 3001

# Start the server
CMD ["npm", "start"] 