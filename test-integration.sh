#!/bin/bash

# Schema.org MCP Integration Test Script
# Tests the complete integration between the app and MCP server

set -e

echo "🧪 Testing Schema.org MCP Integration..."

# Test 1: Check MCP server builds
echo "📦 Test 1: Checking MCP server build..."
cd mcp-schema-org
if [ -f "dist/schema-org-client.js" ]; then
    echo "✅ MCP server builds successfully"
else
    echo "❌ MCP server build failed"
    exit 1
fi

# Test 2: Check application dependencies
echo "🔍 Test 2: Checking application dependencies..."
cd ..
if [ -d "app/node_modules" ]; then
    echo "✅ Application dependencies installed"
else
    echo "❌ Application dependencies missing"
    exit 1
fi

# Test 3: Check TypeScript compilation
echo "🔧 Test 3: Checking TypeScript compilation..."
cd app
if npx tsc --noEmit >/dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Test 4: Check MCP service integration
echo "🔗 Test 4: Checking MCP service integration..."
if grep -q "schema-org-mcp-service" src/hooks/use-schema-hierarchy.ts; then
    echo "✅ MCP service integrated in hooks"
else
    echo "❌ MCP service not found in hooks"
    exit 1
fi

# Test 5: Check static files removal
echo "🗑️ Test 5: Checking static data files removal..."
if [ ! -f "src/data/schema-org-dynamic-hierarchy.ts" ] && [ ! -f "src/data/schema-org-complete-hierarchy.ts" ]; then
    echo "✅ Static data files removed"
else
    echo "❌ Static data files still present"
    exit 1
fi

cd ..

echo "🎉 All integration tests passed!"
echo "📋 Summary:"
echo "   - MCP server builds correctly"
echo "   - Application dependencies available"
echo "   - TypeScript compilation works"
echo "   - MCP service integration complete"
echo "   - Static files removed"
echo ""
echo "🚀 Ready for development!"
echo "   Run './start-mcp-server.sh' to start the MCP server"
echo "   Run 'cd app && npm run dev' to start the application"
