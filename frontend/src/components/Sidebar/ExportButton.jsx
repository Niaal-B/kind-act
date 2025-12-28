import React from 'react';
import { exportToCSV, exportToJSON } from '../../utils/export';
import { Download, FileText, Table } from 'lucide-react';
import './ExportButton.css';

const ExportButton = ({ acts, stats }) => {
  const handleExport = (format) => {
    if (!acts || acts.length === 0) {
      alert('No data to export');
      return;
    }

    if (format === 'csv') {
      exportToCSV(acts, 'santa_acts');
    } else if (format === 'json') {
      exportToJSON(acts, 'santa_acts');
    }
  };

  return (
    <div className="export-section">
      <h4><Download size={18} /> Export Data</h4>
      <div className="export-buttons">
        <button
          className="export-btn csv"
          onClick={() => handleExport('csv')}
          title="Export as CSV"
        >
          <Table size={16} /> Export CSV
        </button>
        <button
          className="export-btn json"
          onClick={() => handleExport('json')}
          title="Export as JSON"
        >
          <FileText size={16} /> Export JSON
        </button>
      </div>
      {stats && (
        <div className="export-info">
          <small>Total: {stats.total_acts || acts.length} acts</small>
        </div>
      )}
    </div>
  );
};

export default ExportButton;

