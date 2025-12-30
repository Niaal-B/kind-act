# Christmas Tree Image Guide

## What's New

The tree component has been upgraded to use **image-based rendering** instead of SVG. This provides:

✅ **Better visual quality** - Realistic tree and decorations  
✅ **Easier alignment** - Snap-to-grid and visual guides  
✅ **Professional appearance** - Perfect for hackathon demos  
✅ **Smooth drag-and-drop** - Better user experience  

## Features

### 1. **Snap-to-Grid**
- Toggle snap-to-grid on/off with the control button
- Decorations automatically align to 5% increments
- Makes placement much easier and more organized

### 2. **Grid Overlay**
- Visual guide showing grid lines
- Helps with precise alignment
- Toggle on/off with the control button

### 3. **Drag-and-Drop**
- All decorations (including auto-placed ones) can be repositioned
- Smooth dragging with visual feedback
- Constrained to tree bounds automatically

### 4. **Placeholder Images**
- If images aren't found, the app generates placeholder images automatically
- Uses canvas to create simple tree and decoration graphics
- No errors if images are missing

## Adding Your Own Images

### Step 1: Prepare Images

**Tree Images** (place in `public/assets/tree/`):
- `tree-level-1.png` - Smallest tree (Level 1)
- `tree-level-2.png` - Level 2 tree
- `tree-level-3.png` - Level 3 tree
- `tree-level-4.png` - Level 4 tree
- `tree-level-5.png` - Largest tree (Level 5)

**Recommended specs:**
- Format: PNG with transparency
- Size: 400x600px to 500x700px
- Style: Realistic Christmas tree illustration

**Decoration Images** (place in `public/assets/decorations/`):
- `ornament.png` - Christmas ornament
- `star.png` - Star decoration
- `light.png` - Christmas light
- `garland.png` - Garland
- `gift.png` - Gift box
- `snowflake.png` - Snowflake

**Recommended specs:**
- Format: PNG with transparency
- Size: 60x60px to 80x80px
- Style: Realistic or illustrated decorations

### Step 2: Download Images

**Free image sources:**
- [Unsplash](https://unsplash.com/s/photos/christmas-tree) - High-quality photos
- [Pexels](https://www.pexels.com/search/christmas-tree/) - Free stock photos
- [Pixabay](https://pixabay.com/images/search/christmas%20tree/) - Free images
- [Flaticon](https://www.flaticon.com/search?word=christmas) - Icons and illustrations

**Tips:**
- Use images with transparent backgrounds for decorations
- Ensure tree images are centered and well-lit
- Keep file sizes reasonable (< 500KB per image)

### Step 3: Place Images

Simply copy your images to:
```
frontend/public/assets/tree/
frontend/public/assets/decorations/
```

The app will automatically detect and use them!

## How It Works

1. **Image Loading**: The component tries to load images from the specified paths
2. **Fallback**: If images aren't found, it generates placeholder images using canvas
3. **Positioning**: Decorations use absolute positioning with percentage-based coordinates
4. **Snapping**: When enabled, positions snap to 5% grid increments
5. **Persistence**: Positions are saved to the backend when you drag decorations

## Testing

1. **Without Images**: The app works with auto-generated placeholders
2. **With Images**: Add your images and refresh - they'll be used automatically
3. **Drag Test**: Try dragging decorations with snap-to-grid on/off
4. **Grid Test**: Toggle grid overlay to see alignment guides

## Troubleshooting

**Images not showing?**
- Check file paths match exactly (case-sensitive)
- Ensure images are in `public/assets/` folder
- Check browser console for 404 errors
- Refresh the page after adding images

**Decorations not aligning?**
- Enable snap-to-grid for automatic alignment
- Use grid overlay for visual guides
- Drag decorations slowly for better control

**Performance issues?**
- Optimize image sizes (compress PNGs)
- Use WebP format for better compression
- Consider using smaller decoration images

## Next Steps

1. Add your tree and decoration images
2. Test the drag-and-drop functionality
3. Customize colors and sizes if needed
4. Share your beautifully decorated tree! 🎄

