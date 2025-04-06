#!/bin/bash

# This script runs the Java backend tests and generates test reports
# It's designed to be executed by a Jenkins pipeline

# Exit on any error
set -e

echo "Starting Java backend tests..."

# Navigate to the java-backend directory
cd java-backend

# Clean and run tests with Maven
echo "Running Maven tests..."
mvn clean test

# Generate coverage report
echo "Generating coverage report..."
mvn jacoco:report

# Check if the test reports directory exists
if [ -d "target/surefire-reports" ]; then
    echo "Test reports generated successfully in target/surefire-reports"
else
    echo "Error: Test reports directory not found"
    exit 1
fi

# Check if the coverage report exists
if [ -f "target/site/jacoco/index.html" ]; then
    echo "Coverage report generated successfully in target/site/jacoco"
else
    echo "Warning: Coverage report not found"
fi

echo "Java backend tests completed successfully"
exit 0