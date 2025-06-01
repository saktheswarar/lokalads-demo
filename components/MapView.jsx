'use client';

import { useState } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const MapView = ({ properties }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [selectedProperty, setSelectedProperty] = useState(null);

  if (!isLoaded) return <p>Loading map...</p>;

  // Filter only valid properties with numeric coordinates
  const validProperties = properties.filter(
    (p) => p.location?.lat && p.location?.lng
  );

  const center =
    validProperties.length > 0
      ? {
          lat: parseFloat(validProperties[0].location.lat),
          lng: parseFloat(validProperties[0].location.lng),
        }
      : { lat: 37.7749, lng: -122.4194 };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {validProperties.map((property) => (
        <Marker
          key={property._id}
          position={{
            lat: parseFloat(property.location.lat),
            lng: parseFloat(property.location.lng),
          }}
          onClick={() => setSelectedProperty(property)}
        />
      ))}

      {selectedProperty && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedProperty.location.lat),
            lng: parseFloat(selectedProperty.location.lng),
          }}
          onCloseClick={() => setSelectedProperty(null)}
        >
          <div className="max-w-xs">
            <h2 className="font-semibold text-lg mb-1">{selectedProperty.name}</h2>
            <p className="text-sm text-gray-600 mb-1">
              {selectedProperty.location.address}
            </p>
            <p className="text-sm text-gray-800 font-medium">
              ${selectedProperty.rates?.monthly || 'N/A'} / month
            </p>
            <a
              href={`/properties/${selectedProperty._id}`}
              className="text-blue-500 underline text-sm mt-2 inline-block"
            >
              View Details
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapView;
