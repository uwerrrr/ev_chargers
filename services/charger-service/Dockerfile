# Use a lightweight Node.js image.
FROM node:20-alpine

# Set the working directory.
WORKDIR /usr/src/app

# Install dependencies.
COPY package*.json ./
RUN npm install

# Copy application code.
COPY . .

# Expose the service port.
EXPOSE 3001

# Start command.
CMD [ "npm", "start" ]

