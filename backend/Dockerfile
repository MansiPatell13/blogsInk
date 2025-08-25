FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p ./uploads/blog-covers
RUN mkdir -p ./uploads/avatars
RUN mkdir -p ./uploads/content
RUN mkdir -p ./uploads/categories

# Set proper permissions
RUN chmod -R 755 ./uploads

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]