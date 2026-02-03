# Use official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY playwright.config.ts ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY pages/ ./pages/
COPY tests/ ./tests/
COPY utils/ ./utils/

# Create downloads directory
RUN mkdir -p downloads

# Set environment variable to run in headless mode
ENV CI=true

# Run tests by default
CMD ["npm", "test"]
