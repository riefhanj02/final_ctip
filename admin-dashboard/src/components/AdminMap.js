import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllSightings } from '../services/apiService';
import './AdminMap.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to fit map bounds
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

const AdminMap = () => {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [filter, setFilter] = useState('all'); // all, rare, common, recent

  useEffect(() => {
    loadSightings();
  }, []);

  const loadSightings = async () => {
    setLoading(true);
    const result = await getAllSightings();
    
    if (result.success) {
      // Transform API data to map format
      // Adjust based on your actual API response structure
      const transformed = result.data?.items || result.data || [];
      setSightings(transformed);
    } else {
      // Fallback to demo data if API fails
      setSightings([
        {
          id: '1',
          name: 'Shorea macrophylla',
          description: 'Engkabang Jantong • Rare',
          rarity: 'Rare',
          habitat: 'Lowland',
          latitude: 1.5569,
          longitude: 110.3442,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Avicennia alba',
          description: 'Api-api Hitam • Common (Mangrove)',
          rarity: 'Common',
          habitat: 'Mangrove',
          latitude: 1.7108,
          longitude: 110.4479,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Eurycoma longifolia',
          description: 'Tongkat Ali • Vulnerable',
          rarity: 'Vulnerable',
          habitat: 'Lowland',
          latitude: 1.7544,
          longitude: 110.3318,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
  };

  const filteredSightings = sightings.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'rare') return s.rarity === 'Rare' || s.rarity === 'Vulnerable';
    if (filter === 'common') return s.rarity === 'Common';
    if (filter === 'recent') {
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return new Date(s.createdAt).getTime() > dayAgo;
    }
    return true;
  });

  const bounds = filteredSightings
    .filter((s) => s.latitude && s.longitude)
    .map((s) => [s.latitude, s.longitude]);

  const getMarkerColor = (rarity) => {
    if (rarity === 'Rare' || rarity === 'Vulnerable') return 'red';
    return 'green';
  };

  const customIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // Default center: Kuching, Sarawak
  const defaultCenter = [1.5533, 110.3592];
  const defaultZoom = 12;

  return (
    <div className="admin-map-container">
      <div className="admin-map-header">
        <h2>Admin Map View</h2>
        <div className="map-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'rare' ? 'active' : ''}
            onClick={() => setFilter('rare')}
          >
            Rare
          </button>
          <button
            className={filter === 'common' ? 'active' : ''}
            onClick={() => setFilter('common')}
          >
            Common
          </button>
          <button
            className={filter === 'recent' ? 'active' : ''}
            onClick={() => setFilter('recent')}
          >
            Recent (24h)
          </button>
          <button onClick={loadSightings} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      <div className="map-stats">
        <span>Total Sightings: {sightings.length}</span>
        <span>Filtered: {filteredSightings.length}</span>
      </div>

      {loading ? (
        <div className="map-loading">Loading map data...</div>
      ) : (
        <div className="map-wrapper">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {bounds.length > 0 && <FitBounds bounds={bounds} />}
            
            {filteredSightings.map((sighting) => (
              <Marker
                key={sighting.id}
                position={[sighting.latitude, sighting.longitude]}
                icon={customIcon(getMarkerColor(sighting.rarity))}
                eventHandlers={{
                  click: () => setSelectedSighting(sighting),
                }}
              >
                <Popup>
                  <div className="sighting-popup">
                    <h3>{sighting.name}</h3>
                    <p>{sighting.description || sighting.habitat}</p>
                    <p><strong>Rarity:</strong> {sighting.rarity}</p>
                    {sighting.createdAt && (
                      <p><strong>Date:</strong> {new Date(sighting.createdAt).toLocaleDateString()}</p>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (window.confirm('Delete this sighting?')) {
                          // Handle delete
                          console.log('Delete:', sighting.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {selectedSighting && (
        <div className="sighting-details-panel">
          <button className="close-btn" onClick={() => setSelectedSighting(null)}>
            ×
          </button>
          <h3>{selectedSighting.name}</h3>
          <p>{selectedSighting.description}</p>
          <p><strong>Rarity:</strong> {selectedSighting.rarity}</p>
          <p><strong>Habitat:</strong> {selectedSighting.habitat}</p>
          <p><strong>Coordinates:</strong> {selectedSighting.latitude}, {selectedSighting.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default AdminMap;

