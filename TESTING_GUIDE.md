# Testing Guide for Instagram-Style Act Details

## Quick Start

### 1. Start Backend Server
```bash
cd backend
python manage.py runserver
```
Backend runs on: http://localhost:8000

### 2. Start Frontend Server (new terminal)
```bash
cd frontend
npm install  # First time only
npm run dev
```
Frontend runs on: http://localhost:3000

### 3. Add Test Data with Images (optional)
```bash
cd backend
python manage.py shell < add_test_data_with_images.py
```

## Testing the Instagram-Style Feature

### Steps:
1. Open http://localhost:3000 in your browser
2. Wait for the map to load
3. **Click on any heat spot** on the map (areas showing red/yellow heat)
4. An Instagram-style card should appear centered on screen

### What to Verify:

✅ **Modal appears:**
- Dark overlay background
- Centered card (max-width: 600px)
- Smooth animation on open

✅ **Header Section:**
- User avatar (circular icon)
- Username displayed ("Sarah Johnson" or "Anonymous User")
- Category badge below username
- Appreciation count with heart icon

✅ **Image Section:**
- Image displays prominently if evidence_url exists
- Image fits properly (object-fit: contain)
- If no image: shows placeholder with icon

✅ **Actions Bar:**
- Appreciation count with heart icon
- Displays below image

✅ **Caption Section:**
- Format: "username description text"
- Description appears as caption
- Multi-line text wraps properly

✅ **Metadata:**
- Location with map pin icon
- Date with calendar icon
- Clean layout at bottom

✅ **Navigation (if multiple acts):**
- Previous/Next buttons on sides
- Counter showing "1 / 5" etc.
- Smooth transitions between acts

✅ **Functionality:**
- Close button (X) works
- Clicking outside closes modal
- Navigation buttons work
- All text is readable

## Troubleshooting

**No acts showing:**
- Run: `python manage.py shell < add_test_data_with_images.py`
- Or add acts manually through the form

**Images not loading:**
- Check browser console for CORS/loading errors
- Verify evidence_url in database contains valid image URLs
- Test URLs directly in browser

**Card not appearing:**
- Check browser console for errors
- Verify backend API is running
- Check network tab for API calls
