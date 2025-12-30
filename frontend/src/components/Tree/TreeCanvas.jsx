import React, { useRef, useEffect, useState } from 'react';
import './TreeCanvas.css';

// Image paths - replace these with actual images in public/assets/
const TREE_IMAGES = {
  1: '/assets/tree/tree-level-1.png',
  2: '/assets/tree/tree-level-2.png',
  3: '/assets/tree/tree-level-3.png',
  4: '/assets/tree/tree-level-4.png',
  5: '/assets/tree/tree-level-5.png',
};

const DECORATION_IMAGES = {
  ornament: '/assets/decorations/ornament.png',
  star: '/assets/decorations/star.png',
  light: '/assets/decorations/light.png',
  garland: '/assets/decorations/garland.png',
  gift: '/assets/decorations/gift.png',
  snowflake: '/assets/decorations/snowflake.png',
};

// Function to remove white/black backgrounds from images
const removeImageBackground = (imageUrl, callback, isDecoration = false) => {
  const img = new Image();
  // Don't set crossOrigin for same-origin images (local files)
  // img.crossOrigin = 'anonymous';
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // For decorations, use more aggressive background removal
    const whiteThreshold = isDecoration ? 235 : 250; // Lower threshold for decorations to remove more
    const blackThreshold = isDecoration ? 40 : 25;
    
    // Sample corner pixels to determine background color
    const corners = [
      data[0], data[1], data[2], // Top-left
      data[(canvas.width - 1) * 4], data[(canvas.width - 1) * 4 + 1], data[(canvas.width - 1) * 4 + 2], // Top-right
      data[(canvas.height - 1) * canvas.width * 4], data[(canvas.height - 1) * canvas.width * 4 + 1], data[(canvas.height - 1) * canvas.width * 4 + 2], // Bottom-left
      data[(canvas.height * canvas.width - 1) * 4], data[(canvas.height * canvas.width - 1) * 4 + 1], data[(canvas.height * canvas.width - 1) * 4 + 2] // Bottom-right
    ];
    
    // Calculate average corner color (likely background)
    let avgR = 0, avgG = 0, avgB = 0;
    for (let i = 0; i < corners.length; i += 3) {
      avgR += corners[i];
      avgG += corners[i + 1];
      avgB += corners[i + 2];
    }
    avgR = Math.round(avgR / (corners.length / 3));
    avgG = Math.round(avgG / (corners.length / 3));
    avgB = Math.round(avgB / (corners.length / 3));
    
    // Remove backgrounds that match corner colors or are near white/black
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      
      // Calculate color difference from corner (background) color
      const colorDiff = Math.abs(r - avgR) + Math.abs(g - avgG) + Math.abs(b - avgB);
      
      // Calculate pixel position to check if it's on the edge
      const pixelIndex = i / 4;
      const x = pixelIndex % canvas.width;
      const y = Math.floor(pixelIndex / canvas.width);
      const isEdgePixel = x === 0 || x === canvas.width - 1 || y === 0 || y === canvas.height - 1;
      
      // For checkerboard patterns, remove ALL pure white and pure black pixels
      // Checkerboard backgrounds are alternating pure white/black squares
      if (r === 255 && g === 255 && b === 255) {
        data[i + 3] = 0; // Remove pure white (checkerboard white squares)
      }
      else if (r === 0 && g === 0 && b === 0) {
        data[i + 3] = 0; // Remove pure black (checkerboard black squares)
      }
      // Check if pixel is near white (background) - only in edges or if matches background
      else if ((isEdgePixel || colorDiff < 50) && brightness > whiteThreshold && r > whiteThreshold - 15 && g > whiteThreshold - 15 && b > whiteThreshold - 15) {
        data[i + 3] = 0; // Make transparent
      }
      // Check if pixel is near black (background) - only in edges or if matches background
      else if ((isEdgePixel || colorDiff < 50) && brightness < blackThreshold && r < blackThreshold + 15 && g < blackThreshold + 15 && b < blackThreshold + 15) {
        data[i + 3] = 0; // Make transparent
      }
      // Check if pixel matches corner background color (within tolerance)
      else if (colorDiff < (isDecoration ? 30 : 40)) {
        data[i + 3] = 0; // Make transparent
      }
      // Check for near-white pixels that are likely checkerboard background
      else if (brightness > 248 && Math.abs(r - g) < 3 && Math.abs(g - b) < 3) {
        data[i + 3] = 0; // Remove very light gray/white checkerboard squares
      }
      // Check for near-black pixels that are likely checkerboard background
      else if (brightness < 7 && Math.abs(r - g) < 3 && Math.abs(g - b) < 3) {
        data[i + 3] = 0; // Remove very dark gray/black checkerboard squares
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    callback(canvas.toDataURL('image/png'));
  };
  
  img.onerror = () => {
    // If image fails to load, use original URL
    callback(imageUrl);
  };
  
  img.src = imageUrl;
};

// Fallback: Create tree image using CSS if image not found
const createTreePlaceholder = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  // Draw tree
  const centerX = canvas.width / 2;
  const treeTop = 50;
  const treeBottom = 500;
  const trunkHeight = 50;
  const trunkWidth = 40;
  
  // Tree layers
  const layers = [
    { y: treeTop, width: 40 },
    { y: treeTop + 100, width: 80 },
    { y: treeTop + 200, width: 120 },
    { y: treeTop + 300, width: 160 },
  ];
  
  // Draw tree
  ctx.fillStyle = '#16A34A';
  ctx.beginPath();
  ctx.moveTo(centerX, treeTop);
  layers.forEach(layer => {
    ctx.lineTo(centerX + layer.width, layer.y);
  });
  ctx.lineTo(centerX + layers[layers.length - 1].width, treeBottom);
  ctx.lineTo(centerX - layers[layers.length - 1].width, treeBottom);
  layers.reverse().forEach(layer => {
    ctx.lineTo(centerX - layer.width, layer.y);
  });
  ctx.closePath();
  ctx.fill();
  
  // Draw trunk
  ctx.fillStyle = '#78350F';
  ctx.fillRect(centerX - trunkWidth / 2, treeBottom, trunkWidth, trunkHeight);
  
  return canvas.toDataURL();
};

// Fallback: Create decoration image using emoji/symbols
const createDecorationPlaceholder = (type, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = 60;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  switch (type) {
    case 'ornament':
      ctx.fillStyle = color || '#DC2626';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(centerX, centerY - 8, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'star':
      ctx.fillStyle = color || '#FBBF24';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * 20;
        const y = centerY + Math.sin(angle) * 20;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      break;
    case 'light':
      ctx.fillStyle = color || '#FBBF24';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'gift':
      ctx.fillStyle = color || '#DC2626';
      ctx.fillRect(centerX - 15, centerY - 10, 30, 20);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 15, centerY - 10, 30, 20);
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY);
      ctx.lineTo(centerX + 15, centerY);
      ctx.moveTo(centerX, centerY - 10);
      ctx.lineTo(centerX, centerY + 10);
      ctx.stroke();
      break;
    case 'snowflake':
      ctx.strokeStyle = color || '#BFDBFE';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * 20,
          centerY + Math.sin(angle) * 20
        );
        ctx.stroke();
      }
      break;
    default:
      ctx.fillStyle = color || '#16A34A';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
  }
  
  return canvas.toDataURL();
};

const TreeCanvas = ({ 
  decorations = [], 
  treeLevel = 1, 
  onDecorationClick, 
  onDecorationUpdate,
  onDecorationPositionChange,  // New prop for edit mode temporary updates
  editMode = false,  // New prop for edit mode
  isInteractive = true 
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [treeImage, setTreeImage] = useState(null);
  const [decorationImages, setDecorationImages] = useState({});

  // Grid size for snapping (percentage)
  const GRID_SIZE = 5; // 5% increments

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 600,
          height: containerRef.current.clientHeight || 800,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Load tree image or create placeholder
  useEffect(() => {
    const loadTreeImage = async () => {
      const imagePath = TREE_IMAGES[treeLevel] || TREE_IMAGES[1];
      const img = new Image();
      
      img.onload = () => {
        console.log('Tree image loaded:', imagePath);
        // Process tree image to remove checkerboard/white/black backgrounds
        removeImageBackground(imagePath, (processedImage) => {
          if (processedImage) {
            setTreeImage(processedImage);
          } else {
            // Fallback to original if processing fails
            setTreeImage(imagePath);
          }
        }, false);
      };
      
      img.onerror = () => {
        console.error('Tree image failed to load:', imagePath);
        // Use placeholder if image not found
        setTreeImage(createTreePlaceholder());
      };
      
      img.src = imagePath;
    };
    
    loadTreeImage();
  }, [treeLevel]);

  // Load decoration images or create placeholders
  useEffect(() => {
    const loadDecorationImages = async () => {
      const loaded = {};
      let loadedCount = 0;
      const totalImages = Object.keys(DECORATION_IMAGES).length;
      
      const processImage = (type, path) => {
        const img = new Image();
        img.onload = () => {
          // Process image to remove background
          removeImageBackground(path, (processedImage) => {
            loaded[type] = processedImage;
            loadedCount++;
            
            // Update state when all images are processed
            if (loadedCount === totalImages) {
              setDecorationImages({ ...loaded });
            } else {
              // Update incrementally for better UX
              setDecorationImages({ ...loaded });
            }
          }, true); // true = isDecoration
        };
        img.onerror = () => {
          // Use placeholder if image not found
          loaded[type] = createDecorationPlaceholder(type);
          loadedCount++;
          
          if (loadedCount === totalImages) {
            setDecorationImages({ ...loaded });
          } else {
            setDecorationImages({ ...loaded });
          }
        };
        img.src = path;
      };
      
      // Load all decoration images
      for (const [type, path] of Object.entries(DECORATION_IMAGES)) {
        processImage(type, path);
      }
    };
    
    loadDecorationImages();
  }, []);

  const snapToGridValue = (value) => {
    if (!snapToGrid) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handleMouseDown = (e, decoration) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (decoration.position_x / 100) * dimensions.width;
    const y = (decoration.position_y / 100) * dimensions.height;
    
    setDragging(decoration.id);
    setDragOffset({
      x: e.clientX - rect.left - x,
      y: e.clientY - rect.top - y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !isInteractive) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const decoration = decorations.find(d => d.id === dragging);
    if (!decoration) return;

    const rawX = ((e.clientX - rect.left - dragOffset.x) / dimensions.width) * 100;
    const rawY = ((e.clientY - rect.top - dragOffset.y) / dimensions.height) * 100;

    // Constrain to tree bounds (roughly 25-75% X, 10-85% Y)
    let constrainedX = Math.max(25, Math.min(75, rawX));
    let constrainedY = Math.max(10, Math.min(85, rawY));

    // Snap to grid if enabled
    if (snapToGrid) {
      constrainedX = snapToGridValue(constrainedX);
      constrainedY = snapToGridValue(constrainedY);
    }

    const newPosition = { x: constrainedX, y: constrainedY };

    // In edit mode, use onDecorationPositionChange for temporary updates
    // Otherwise, use onDecorationUpdate for immediate saves
    if (editMode) {
      if (onDecorationPositionChange) {
        onDecorationPositionChange(dragging, newPosition);
      }
    } else {
      if (onDecorationUpdate) {
        onDecorationUpdate(dragging, newPosition);
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging && isInteractive) {
      const moveHandler = (e) => handleMouseMove(e);
      const upHandler = () => handleMouseUp();
      
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
      
      return () => {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, isInteractive, dragOffset, dimensions, decorations, onDecorationUpdate, onDecorationPositionChange, editMode, snapToGrid]);

  const getDecorationImage = (decoration) => {
    const type = decoration.decoration_type;
    return decorationImages[type] || createDecorationPlaceholder(type, decoration.color);
  };

  return (
    <div className="tree-canvas-container" ref={containerRef}>
      {/* Tree background image */}
      <div className="tree-background">
        {treeImage && (
          <img 
            src={treeImage} 
            alt="Christmas Tree"
            className="tree-image"
            onError={(e) => {
              console.error('Error loading tree image:', treeImage);
              e.target.style.display = 'none';
            }}
          />
        )}
        {/* Grid overlay (optional visual guide) */}
        {showGrid && (
          <div className="grid-overlay">
            {Array.from({ length: Math.floor(100 / GRID_SIZE) }).map((_, i) => (
              <React.Fragment key={i}>
                <div 
                  className="grid-line vertical"
                  style={{ left: `${i * GRID_SIZE}%` }}
                />
                <div 
                  className="grid-line horizontal"
                  style={{ top: `${i * GRID_SIZE}%` }}
                />
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Decorations */}
        <div className="decorations-container">
          {decorations.map((decoration, index) => {
            const isDraggingThis = dragging === decoration.id;
            const decorationImg = getDecorationImage(decoration);
            
            return (
              <img
                key={decoration.id}
                src={decorationImg}
                alt={decoration.decoration_type}
                className={`decoration decoration-${decoration.decoration_type} ${
                  isDraggingThis ? 'dragging' : ''
                } ${decoration.is_auto_placed ? 'auto-placed' : 'manual'}`}
                style={{
                  position: 'absolute',
                  left: `${decoration.position_x}%`,
                  top: `${decoration.position_y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${30 * (decoration.size || 1)}px`,
                  height: `${30 * (decoration.size || 1)}px`,
                  cursor: isInteractive 
                    ? (isDraggingThis ? 'grabbing' : 'grab') 
                    : 'default',
                  opacity: isDraggingThis ? 0.8 : 1,
                  zIndex: isDraggingThis ? 100 : 10 + index,
                  filter: decoration.color 
                    ? `drop-shadow(0 0 4px ${decoration.color})` 
                    : 'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                  mixBlendMode: 'normal',
                  backgroundColor: 'transparent',
                  animation: isDraggingThis 
                    ? 'none' 
                    : `decorationAppear 0.6s ease-out ${index * 0.1}s both`,
                }}
                onMouseDown={(e) => isInteractive && handleMouseDown(e, decoration)}
                onClick={() => isInteractive && !isDraggingThis && onDecorationClick?.(decoration)}
                draggable={false}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      {isInteractive && (
        <div className="tree-controls">
          <button
            className={`control-btn ${snapToGrid ? 'active' : ''}`}
            onClick={() => setSnapToGrid(!snapToGrid)}
            title="Toggle snap to grid"
          >
            📐 {snapToGrid ? 'Snap: ON' : 'Snap: OFF'}
          </button>
          <button
            className={`control-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle grid overlay"
          >
            ⚏ {showGrid ? 'Grid: ON' : 'Grid: OFF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TreeCanvas;
