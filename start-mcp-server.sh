#!/bin/bash

# Schema.org MCP Server - Development Setup Script
# This script sets up the MCP server to run continuously for development

set -e

echo "🚀 Setting up Schema.org MCP server for development..."

# Navigate to MCP server directory
cd mcp-schema-org

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing MCP server dependencies..."
    npm install
fi

# Build the server
echo "🔧 Building MCP server..."
npm run build

# Start the MCP server in the background
echo "🔄 Starting MCP server..."
npm start &
MCP_PID=$!

echo "✅ MCP server started with PID: $MCP_PID"
echo "📋 Server will run continuously in the background"
echo "🛑 To stop the server, run: kill $MCP_PID"

# Return to root directory
cd ..

echo "🔗 MCP server is ready for integration with the application"
echo "🌐 Access the application at: http://localhost:3000"
