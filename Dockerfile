
FROM mcr.microsoft.com/playwright:v1.48.2-focal



WORKDIR /app

# Copy package files

COPY package.json package-lock.json* yarn.lock* ./



# Install dependencies

RUN npm install



# Copy source code

COPY . .



# Install Playwright browsers

RUN npx playwright install



# Set CI environment variable for test configuration

ENV CI=true



# Run tests

CMD ["npm", "test"]
