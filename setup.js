#!/usr/bin/env node

/**
 * Project initialization script
 * Run this after cloning the repository
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Origin Energy Automation - Setup Script\n');
console.log('=' .repeat(50));

// Function to run commands
function runCommand(command, description) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} - SUCCESS`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - FAILED`);
    console.error(error.message);
    return false;
  }
}

// Function to create directories
function createDirectory(dir) {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created ${dir}/ directory`);
  } else {
    console.log(`✓ ${dir}/ already exists`);
  }
}

async function setup() {
  console.log('\nStarting setup process...\n');

  // Step 1: Check Node.js version
  console.log('Step 1: Checking Node.js version...');
  const nodeVersion = process.version;
  console.log(`✓ Node.js version: ${nodeVersion}`);
  const major = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (major < 18) {
    console.warn('⚠️  Warning: Node.js 18+ is recommended');
  }

  // Step 2: Create necessary directories
  console.log('\nStep 2: Creating directories...');
  createDirectory('downloads');
  createDirectory('test-results');
  createDirectory('playwright-report');

  // Step 3: Install npm dependencies
  console.log('\nStep 3: Installing dependencies...');
  const npmInstalled = runCommand('npm install', 'Installing npm packages');
  if (!npmInstalled) {
    console.log('\n❌ Setup failed at npm install step');
    process.exit(1);
  }

  // Step 4: Install Playwright browsers
  console.log('\nStep 4: Installing Playwright browsers...');
  const browsersInstalled = runCommand(
    'npx playwright install chromium --with-deps',
    'Installing Chromium browser'
  );
  if (!browsersInstalled) {
    console.log('\n⚠️  Browser installation failed, but you can try manually:');
    console.log('   npx playwright install --with-deps');
  }

  // Step 5: Verify setup
  console.log('\nStep 5: Verifying setup...');
  console.log('Running verification script...\n');
  
  try {
    runCommand('npm run verify', 'Verification');
  } catch (error) {
    console.log('\n⚠️  Verification script failed, but setup might still be okay');
  }

  // Final message
  console.log('\n' + '='.repeat(50));
  console.log('✅ Setup Complete!\n');
  console.log('Next steps:');
  console.log('  1. Run tests: npm test');
  console.log('  2. View in headed mode: npm run test:headed');
  console.log('  3. Debug mode: npm run test:debug');
  console.log('  4. View report: npm run report');
  console.log('\nFor Docker:');
  console.log('  docker-compose up playwright-tests');
  console.log('\nFor more info, see README.md');
  console.log('='.repeat(50));
}

// Run setup
setup().catch((error) => {
  console.error('\n❌ Setup failed:', error);
  process.exit(1);
});
