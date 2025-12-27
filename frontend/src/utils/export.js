/**
 * Export utilities for data export functionality
 */

/**
 * Convert acts data to CSV format
 */
export const exportToCSV = (acts, filename = 'acts_of_kindness') => {
  if (!acts || acts.length === 0) {
    alert('No data to export');
    return;
  }

  // CSV headers
  const headers = ['ID', 'Description', 'Category', 'City', 'Country', 'Latitude', 'Longitude', 'Submitted By', 'Date'];
  
  // Convert acts to CSV rows
  const rows = acts.map(act => {
    const date = new Date(act.created_at).toLocaleDateString();
    return [
      act.id || '',
      `"${(act.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
      act.category || '',
      act.city || '',
      act.country || '',
      act.latitude || '',
      act.longitude || '',
      act.submitted_by || (act.is_anonymous ? 'Anonymous' : ''),
      date,
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Convert acts data to JSON format
 */
export const exportToJSON = (acts, filename = 'acts_of_kindness') => {
  if (!acts || acts.length === 0) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(acts, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

