import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../../utils/constants';
import './AnalyticsPanel.css';

// Theme colors: Primary (Rose-800), Secondary (Blue-700), Success (Emerald-600), Warning (Orange-500), Purple
const COLORS = ['#9F1239', '#1D4ED8', '#059669', '#F97316', '#7C3AED'];

const AnalyticsPanel = ({ stats, acts }) => {
  if (!stats || !acts) return null;

  // Category breakdown data for pie chart
  const categoryData = Object.entries(stats.category_breakdown || {}).map(([category, count]) => ({
    name: CATEGORY_LABELS[category] || category,
    value: count,
    icon: CATEGORY_ICONS[category] || '🌟',
  }));

  // Top cities data for bar chart
  const getTopCities = () => {
    const cityCounts = {};
    acts.forEach(act => {
      if (act.city) {
        cityCounts[act.city] = (cityCounts[act.city] || 0) + 1;
      }
    });

    return Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const topCities = getTopCities();

  return (
    <div className="analytics-panel">
      <h3 className="analytics-title">📊 Advanced Analytics</h3>

      <div className="chart-section">
        <h4>Category Distribution</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, icon }) => `${icon} ${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h4>Top Cities by Activity</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topCities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="city"
              angle={-45}
              textAnchor="end"
              height={80}
              style={{ fontSize: '12px' }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#9F1239" name="Acts of Kindness" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPanel;

