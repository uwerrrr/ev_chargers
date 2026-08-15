# Use a lightweight Node.js image.
FROM node:24-alpine

# Set the working directory.
WORKDIR /usr/src/app

# Install dependencies.
COPY package*.json ./
RUN npm ci

# Copy application code.
COPY . .

# Expose the service port.
EXPOSE 3003

# Start command.
CMD [ "npm", "start" ]

