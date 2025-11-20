#!/bin/bash

# Fix MUI Grid API for v7 - Replace Grid with Grid2
echo "Fixing MUI Grid to Grid2..."

cd /home/nick/projects/cake-shop

# Replace imports
find src -name "*.tsx" -type f -exec sed -i "s/import { Grid/import { Grid2 as Grid/g" {} +
find src -name "*.tsx" -type f -exec sed -i "s/import {Grid,/import {Grid2 as Grid,/g" {} +

# Replace Grid props: item to size
find src -name "*.tsx" -type f -exec sed -i 's/<Grid item /<Grid size=/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/ item xs=/ size={{ xs: /g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/ item sm=/ size={{ sm: /g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/ item md=/ size={{ md: /g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/ item lg=/ size={{ lg: /g' {} +

echo "Grid fixes applied! Please check the files manually."
