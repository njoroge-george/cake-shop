# Image Upload Guide

This directory stores locally uploaded images for the cake shop application.

## Directory Structure

```
public/images/
├── team/          # Team member profile photos
└── users/         # User profile photos
```

## How to Add Images

### Option 1: Upload via Admin Panel (Recommended)
1. Login as admin at `/login`
2. Go to **Admin → Team Members**
3. Click "Add Member" or edit existing member
4. Click "Choose Image File" button
5. Select an image from your computer
6. Image will be automatically uploaded and saved

### Option 2: Manual Upload
1. Place your image files in the appropriate directory:
   - Team photos: `public/images/team/`
   - User photos: `public/images/users/`
2. Use the admin panel to set the image path:
   - Format: `/images/team/filename.jpg`
   - Example: `/images/team/sarah-mwangi.jpg`

## Image Requirements

- **Formats**: JPG, PNG, WebP
- **Size**: Maximum 5MB per file
- **Recommended Dimensions**: 
  - Team photos: 400x400px (square)
  - User photos: 300x300px (square)
- **Aspect Ratio**: Square (1:1) works best

## Image Naming

When uploading via admin panel:
- Files are automatically renamed with timestamp
- Format: `original-name-1234567890.jpg`
- Spaces are replaced with hyphens
- All lowercase

## Example Team Member Images

Place your team member photos here and they'll be accessible at:
- `/images/team/sarah-mwangi-1234567890.jpg`
- `/images/team/david-ochieng-1234567890.jpg`
- etc.

## Notes

- Images uploaded via the admin panel are stored permanently
- Delete unused images manually from this directory to save space
- Images are publicly accessible (no authentication required)
- For production, consider using a CDN or cloud storage service
