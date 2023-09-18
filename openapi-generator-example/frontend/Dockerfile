# Use node:latest as the base image for the build stage
FROM node:latest AS build

# Set the working directory to /build
WORKDIR /build

# Copy the client folder to /build
COPY . .

# Go to the client folder and install dependencies, create production build, and pack the app
RUN cd /build/todoclient && npm install && npm run build && npm pack &&  npm install -g *.tgz --save

# Install npm packages using npm ci
RUN cd /build && npm install -g
CMD [ "npm","run","start" ]