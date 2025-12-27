// Helper functions

/**
 * Transform acts data for heatmap format [lat, lng, intensity]
 */
export const transformActsForHeatmap = (acts) => {
  if (!acts || acts.length === 0) return [];
  
  return acts.map(act => [
    parseFloat(act.latitude),
    parseFloat(act.longitude),
    0.8 // Default intensity
  ]);
};

/**
 * Get unique cities from acts
 */
export const getUniqueCities = (acts) => {
  const cities = acts
    .filter(act => act.city && act.city.trim() !== '')
    .map(act => act.city);
  return [...new Set(cities)];
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

