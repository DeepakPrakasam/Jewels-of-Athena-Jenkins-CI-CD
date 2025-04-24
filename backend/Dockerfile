# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the internal port your app uses (4000 as per your .env)
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
