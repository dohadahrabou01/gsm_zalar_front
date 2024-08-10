# Pull the official base image
FROM node:18-alpine

# Set working directory
WORKDIR /gsm_zalar_front

# Add `/gsm_zalar_front/node_modules/.bin` to $PATH
ENV PATH /gsm_zalar_front/node_modules/.bin:$PATH

# Install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps

# Add app
COPY . ./

# Expose the port (if needed)
EXPOSE 3000

# Start app
CMD ["npm", "start"]
