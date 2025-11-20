#!/bin/bash

echo "Testing Messages API..."
echo ""

# Test creating a message
echo "1. Creating a test message..."
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+254712345678",
    "subject": "Test Message",
    "message": "This is a test message from the API test script."
  }' | jq '.'

echo ""
echo "Test complete!"
echo ""
echo "Check your browser console and server logs for detailed error messages if this failed."
