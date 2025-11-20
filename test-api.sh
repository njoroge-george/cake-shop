#!/bin/bash

echo "🧪 Testing Cakes API..."
echo ""

# Get all cakes
echo "1. Fetching all cakes:"
RESPONSE=$(curl -s http://localhost:3000/api/cakes)
echo "$RESPONSE" | head -c 500
echo ""
echo ""

# Extract first cake ID
CAKE_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$CAKE_ID" ]; then
  echo "2. Testing cake detail with ID: $CAKE_ID"
  curl -s "http://localhost:3000/api/cakes/$CAKE_ID" | head -c 500
  echo ""
else
  echo "❌ No cakes found!"
fi
