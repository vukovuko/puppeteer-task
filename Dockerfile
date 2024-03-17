# docker build -t puppeteer-app .
# docker run -p 4000:4000 puppeteer-app

# Use Node.js 20 as the base image
FROM node:20

# Update and install necessary dependencies for Chrome
RUN apt-get update && apt-get install -y wget gnupg python3 software-properties-common make gcc g++ \
  && wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Set the cache directory for Puppeteer to the default path
ENV PUPPETEER_CACHE_DIR=/home/node/.cache/puppeteer

# Create a non-root user to run the application
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs

# Switch to the app directory
WORKDIR /app

# Copy package.json and package-lock.json/npm-shrinkwrap.json
COPY package.json package-lock.json ./

# Install app dependencies as the non-root user
RUN npm install --unsafe-perm=true --allow-root

# Change ownership of the app directory to the non-root user
RUN chown -R nodejs:nodejs /app

# Bundle app source
COPY . .

# Build your TypeScript project
RUN npm run build

# Expose port 4000 to the outside once the container has launched
EXPOSE 4000

# Run the compiled app as the non-root user
USER nodejs

# Command to start the application
CMD ["node", "dist/index.js"]