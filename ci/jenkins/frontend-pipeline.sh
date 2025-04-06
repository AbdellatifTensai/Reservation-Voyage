#!/bin/bash
# This script is to be executed by Jenkins to run frontend tests

# Exit on error
set -e

# Navigate to the client directory
cd client

# Install dependencies
echo "Installing frontend dependencies..."
npm ci

# Run ESLint
echo "Running ESLint..."
npm run lint || echo "Linting issues found, but continuing..."

# Run tests
echo "Running frontend tests..."
npm test

# Create a report directory if it doesn't exist
mkdir -p test-reports

# Run tests with coverage
echo "Generating coverage report..."
npm run test:coverage

echo "Frontend tests completed successfully"