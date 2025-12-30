import html2canvas from 'html2canvas';

/**
 * Wait for all images within an element to load
 * @param {HTMLElement} element - Element containing images
 * @returns {Promise<void>}
 */
const waitForImages = (element) => {
  return new Promise((resolve) => {
    const images = element.querySelectorAll('img');
    if (images.length === 0) {
      resolve();
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;
    let resolved = false;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalImages && !resolved) {
        resolved = true;
        // Longer delay to ensure rendering is complete, especially for absolutely positioned elements
        setTimeout(resolve, 300);
      }
    };

    images.forEach((img) => {
      // Force reload check
      if (img.complete && img.naturalHeight !== 0 && img.naturalWidth !== 0) {
        // Image already loaded and has dimensions
        checkComplete();
      } else {
        // Wait for image to load
        const onLoadHandler = () => {
          // Double check it's actually loaded
          if (img.complete && img.naturalHeight > 0) {
            checkComplete();
          }
        };
        img.onload = onLoadHandler;
        img.onerror = checkComplete; // Count errors as loaded to avoid hanging
        
        // If image src is a data URL or already set, trigger load check
        if (img.src && (img.src.startsWith('data:') || img.complete)) {
          setTimeout(() => {
            if (img.complete && img.naturalHeight > 0) {
              checkComplete();
            }
          }, 100);
        }
      }
    });

    // Fallback timeout in case some images never load
    setTimeout(() => {
      if (!resolved) {
        console.warn('Some images may not have loaded:', totalImages - loadedCount, 'remaining');
        resolved = true;
        resolve();
      }
    }, 10000); // Increased timeout
  });
};

/**
 * Export tree as image with stats overlay
 * @param {HTMLElement} treeElement - The tree container element to capture
 * @param {Object} treeData - Tree data with stats
 * @param {string} username - Username to display
 * @returns {Promise<Blob>} - Image blob
 */
export const exportTreeAsImage = async (treeElement, treeData, username) => {
  if (!treeElement) {
    throw new Error('Tree element not found');
  }

  // Hide controls during export
  const controls = treeElement.querySelector('.tree-controls');
  const originalControlsDisplay = controls ? controls.style.display : '';
  if (controls) {
    controls.style.display = 'none';
  }

  try {
    // Wait for all images to load before capturing
    await waitForImages(treeElement);
    
    // Additional delay to ensure absolutely positioned elements are rendered
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simply capture the entire tree-canvas-container as-is
    const canvas = await html2canvas(treeElement, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: true, // Enable logging to debug
      imageTimeout: 30000, // 30 seconds timeout
      removeContainer: false,
      onclone: (clonedDoc, clonedElement) => {
        // Find the cloned tree container in the cloned document
        const clonedContainer = clonedDoc.querySelector('.tree-canvas-container') || clonedElement;
        const clonedTreeBackground = clonedContainer.querySelector('.tree-background');
        const clonedDecorationsContainer = clonedContainer.querySelector('.decorations-container');
        
        // Ensure decorations container is visible
        if (clonedDecorationsContainer) {
          clonedDecorationsContainer.style.display = 'block';
          clonedDecorationsContainer.style.visibility = 'visible';
          clonedDecorationsContainer.style.opacity = '1';
          clonedDecorationsContainer.style.position = 'absolute';
          clonedDecorationsContainer.style.top = '0';
          clonedDecorationsContainer.style.left = '0';
          clonedDecorationsContainer.style.width = '100%';
          clonedDecorationsContainer.style.height = '100%';
          clonedDecorationsContainer.style.pointerEvents = 'none';
          clonedDecorationsContainer.style.zIndex = '10';
        }
        
        // Ensure all decoration images are visible and properly positioned
        const decorations = clonedContainer.querySelectorAll('.decoration');
        console.log('Found decorations in clone:', decorations.length);
        decorations.forEach((dec, index) => {
          dec.style.display = 'block';
          dec.style.visibility = 'visible';
          dec.style.opacity = '1';
          dec.style.position = 'absolute';
          dec.style.zIndex = (10 + index).toString();
          // Remove any filters that might interfere
          dec.style.filter = '';
          dec.style.mixBlendMode = 'normal';
          dec.style.backgroundColor = 'transparent';
        });
        
        // Also ensure ALL images are visible (tree + decorations)
        const allImages = clonedContainer.querySelectorAll('img');
        console.log('Found total images in clone:', allImages.length);
        allImages.forEach((img, index) => {
          img.style.display = 'block';
          img.style.visibility = 'visible';
          img.style.opacity = '1';
          // Force image to be visible
          if (img.complete && img.naturalWidth === 0) {
            // Image might not have loaded, try to reload
            const src = img.src;
            if (src) {
              img.src = '';
              img.src = src;
            }
          }
        });
        
        // Ensure tree background is visible
        if (clonedTreeBackground) {
          clonedTreeBackground.style.display = 'flex';
          clonedTreeBackground.style.visibility = 'visible';
          clonedTreeBackground.style.opacity = '1';
        }
      },
    });

    // Create a new canvas for the final image with overlay
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    
    // Set dimensions (add space for overlay at bottom)
    const padding = 40;
    const overlayHeight = 120;
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height + overlayHeight + padding;

    // Fill background with gradient (matching tree background)
    const gradient = ctx.createLinearGradient(0, 0, 0, finalCanvas.height);
    gradient.addColorStop(0, '#E0F2FE');
    gradient.addColorStop(0.5, '#F0F9FF');
    gradient.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Draw the tree canvas (centered)
    ctx.drawImage(canvas, 0, 0);

    // Draw overlay with stats
    const overlayY = canvas.height + padding;
    
    // Draw semi-transparent background for stats
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(0, overlayY, finalCanvas.width, overlayHeight);

    // Draw border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, overlayY, finalCanvas.width, overlayHeight);

    // Draw stats text
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${username}'s Christmas Tree`, finalCanvas.width / 2, overlayY + 35);

    // Draw stats
    ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#64748B';
    
    const statsY = overlayY + 70;
    const statsSpacing = 30;
    let xOffset = finalCanvas.width / 2 - 150;

    // Acts of Kindness
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${treeData?.total_acts || 0}`, xOffset, statsY);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Acts of Kindness', xOffset, statsY + 20);

    // Decorations
    xOffset = finalCanvas.width / 2;
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${treeData?.total_decorations || 0}`, xOffset, statsY);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Decorations', xOffset, statsY + 20);

    // Tree Level
    xOffset = finalCanvas.width / 2 + 150;
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Level ${treeData?.tree_level || 1}`, xOffset, statsY);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Tree Level', xOffset, statsY + 20);

    // Draw website/logo at bottom
    ctx.fillStyle = '#9F1239';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🎄 Christmas Tree of Kindness', finalCanvas.width / 2, overlayY + overlayHeight - 10);

    // Convert to blob
    return new Promise((resolve) => {
      finalCanvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 0.95);
    });
  } catch (error) {
    console.error('Error exporting tree:', error);
    throw error;
  } finally {
    // Ensure controls are restored even if there's an error
    if (controls) {
      controls.style.display = originalControlsDisplay;
    }
  }
};

/**
 * Download tree image
 * @param {Blob} blob - Image blob
 * @param {string} filename - Filename for download
 */
export const downloadTreeImage = (blob, filename = 'my-christmas-tree.png') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Share tree image using Web Share API
 * @param {Blob} blob - Image blob
 * @param {string} text - Share text
 */
export const shareTreeImage = async (blob, text = 'Check out my Christmas Tree of Kindness!') => {
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], 'christmas-tree.png', { type: 'image/png' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Christmas Tree of Kindness',
          text: text,
        });
        return true;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  }
  
  // Fallback: copy image to clipboard and show message
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    alert('Tree image copied to clipboard! You can paste it anywhere.');
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Final fallback: download
    downloadTreeImage(blob);
    alert('Image downloaded! Share it manually.');
    return false;
  }
};
