#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up BlogSink MERN Stack Project...\n')

// Check if Node.js is installed
try {
  const nodeVersion = process.version
  console.log(`✅ Node.js ${nodeVersion} detected`)
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.')
  process.exit(1)
}

// Function to run commands
function runCommand(command, cwd) {
  try {
    execSync(command, { cwd, stdio: 'inherit' })
    return true
  } catch (error) {
    return false
  }
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...')
if (runCommand('npm install', 'frontend')) {
  console.log('✅ Frontend dependencies installed successfully')
} else {
  console.log('❌ Failed to install frontend dependencies')
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...')
if (runCommand('npm install', 'backend')) {
  console.log('✅ Backend dependencies installed successfully')
} else {
  console.log('❌ Failed to install backend dependencies')
}

console.log('\n🎉 Setup completed!')
console.log('\n📋 Next steps:')
console.log('1. Start MongoDB (local or Atlas)')
console.log('2. Start backend: cd backend && npm run dev')
console.log('3. Start frontend: cd frontend && npm run dev')
console.log('4. Open http://localhost:3000 in your browser')
console.log('\n📚 Check README.md for detailed instructions')
