# Install latest node dependency
FROM node:11

# Create app directory
WORKDIR /usr/src/app

# Copy package file with dependencies
COPY package*.json ./

RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python 

# Install dependencies
RUN yarn install --production

# Copy app to docker
COPY . .

# Expose port to listen server
EXPOSE 500

# Run server
CMD ["npm", "start"]
