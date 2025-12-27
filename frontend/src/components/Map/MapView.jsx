import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Import leaflet.heat - it modifies L.heatLayer globally
import 'leaflet.heat';

const MapView = ({ acts, onMapClick, center = [20, 0], zoom = 2 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView(center, zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 2,
      }).addTo(mapInstanceRef.current);

      // Handle map clicks
      if (onMapClick) {
        mapInstanceRef.current.on('click', (e) => {
          onMapClick({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          });
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view when center/zoom changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update heatmap when acts data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) {
      return;
    }

    const updateHeatLayer = () => {
      // Remove existing heat layer
      if (heatLayerRef.current) {
        mapInstanceRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }

      if (!acts || !Array.isArray(acts) || acts.length === 0) {
        console.log('No acts data or empty array');
        return;
      }

      if (!L.heatLayer) {
        console.error('Leaflet.heat plugin not loaded');
        return;
      }

      try {
        // Transform acts data for heatmap [lat, lng, intensity]
        const heatData = acts
          .filter(act => act.latitude && act.longitude) // Filter out invalid coordinates
          .map(act => {
            const lat = parseFloat(act.latitude);
            const lng = parseFloat(act.longitude);
            // Validate coordinates
            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
              console.warn('Invalid coordinates:', act);
              return null;
            }
            return [lat, lng, 0.8];
          })
          .filter(point => point !== null); // Remove null entries

        if (heatData.length === 0) {
          console.log('No valid heatmap data points');
          return;
        }

        console.log(`Creating heatmap with ${heatData.length} points:`, heatData);

        // Create heat layer using L.heatLayer (from leaflet.heat package)
        heatLayerRef.current = L.heatLayer(heatData, {
          radius: 50,
          blur: 30,
          maxZoom: 18,
          max: 1.0,
          minOpacity: 0.4,
          gradient: {
            0.0: '#0000FF',
            0.1: '#0066FF',
            0.2: '#00CCFF',
            0.3: '#33FFCC',
            0.4: '#66FF99',
            0.5: '#99FF66',
            0.6: '#CCFF33',
            0.65: '#FFCC00',
            0.7: '#FF9900',
            0.75: '#FF6600',
            0.8: '#FF3300',
            0.85: '#FF0000',
            0.9: '#CC0000',
            0.95: '#990000',
            1.0: '#660000'
          }
        });

        heatLayerRef.current.addTo(mapInstanceRef.current);
        console.log('Heatmap layer added successfully');
      } catch (error) {
        console.error('Error creating heatmap:', error);
      }
    };

    // Update heatmap - L.heatLayer should be available from import
    updateHeatLayer();
  }, [acts]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="leaflet-map" />
      <div className="map-legend">
        <h4>Activity Level</h4>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#FF0000' }}></div>
          <span>Very High</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#FF6B35' }}></div>
          <span>High</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#FFB800' }}></div>
          <span>Medium</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#4A90E2' }}></div>
          <span>Low</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
