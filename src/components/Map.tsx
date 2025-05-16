import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { useAppContext } from '../context/AppContext';
import { getCategoryInfo } from '../utils/categoryUtils';
import { Loader2 } from 'lucide-react';

// Map center update component
const MapCenterUpdater = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16);
    }
  }, [center, map]);
  
  return null;
};

export const Map = () => {
  const { center, radius, sensitivePlaces, bettingShops, isLoading } = useAppContext();
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Default location (Rome, Italy) if no center is provided
  const defaultLocation: [number, number] = [41.9028, 12.4964];
  const mapCenter = center || defaultLocation;
  const zoom = center ? 16 : 5;
  
  useEffect(() => {
    if (!mapInitialized && center) {
      setMapInitialized(true);
    }
  }, [center, mapInitialized]);
  
  const createMarkerIcon = (category: string) => {
    const info = getCategoryInfo(category);
    
    return new DivIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${info.color};" class="marker-pin"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
  };
  
  return (
    <div className="relative h-[500px] w-full">
      <MapContainer 
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenterUpdater center={center} />
        
        {center && (
          <>
            {/* Marker for the searched address */}
            <Marker 
              position={center}
              icon={new Icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-medium">Indirizzo cercato</div>
                  <div className="text-sm text-gray-600">Centro del raggio di ricerca</div>
                </div>
              </Popup>
            </Marker>
            
            {/* Circle showing the search radius */}
            <Circle 
              center={center}
              radius={radius}
              pathOptions={{ 
                fillColor: '#3949AB',
                fillOpacity: 0.1,
                color: '#3949AB',
                weight: 2
              }}
            />
            
            {/* Markers for sensitive places */}
            {sensitivePlaces.map((place) => (
              <Marker
                key={place.id}
                position={place.coordinates}
                icon={createMarkerIcon(place.category)}
              >
                <Popup>
                  <div>
                    <h3 className="font-medium">{place.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getCategoryInfo(place.category).label}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Distanza:</span> {place.distance} metri
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Markers for betting shops */}
            {bettingShops.map((place) => (
              <Marker
                key={place.id}
                position={place.coordinates}
                icon={createMarkerIcon(place.category)}
              >
                <Popup>
                  <div>
                    <h3 className="font-medium">{place.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getCategoryInfo(place.category).label}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Distanza:</span> {place.distance} metri
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="mt-2 font-medium text-gray-700">Caricamento in corso...</p>
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .marker-pin {
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        
        .marker-pin::after {
          content: '';
          width: 12px;
          height: 12px;
          margin: 4px 0 0 4px;
          background: white;
          position: absolute;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};