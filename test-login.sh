#!/bin/bash

echo "🧪 Testing Login API..."
echo ""

curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cakeshop.com",
    "password": "admin123"
  }' \
  -v 2>&1 | head -50

echo ""
echo "---"
echo "Testing NextAuth signin endpoint..."
echo ""

curl -X POST 'http://localhost:3000/api/auth/signin/credentials' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@cakeshop.com", 
    "password": "admin123",
    "callbackUrl": "http://localhost:3000"
  }' \
  -v 2>&1 | head -50
