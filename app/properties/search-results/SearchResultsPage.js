// app/properties/search-results/SearchResultsPage.js

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowAltCircleLeft, FaMapMarkerAlt } from 'react-icons/fa';
import PropertyCard from '@/components/PropertyCard';
import PropertySearchForm from '@/components/PropertySearchForm';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const SearchResultsPage = ({ properties }) => {
  const [isMapView, setIsMapView] = useState(false);

  const defaultCenter = {
    lat: properties[0]?.location.lat || 0,
    lng: properties[0]?.location.lng || 0,
  };

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link
            href="/properties"
            className="flex items-center text-blue-500 hover:underline mb-3"
          >
            <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Properties
          </Link>
          <h1 className="text-2xl mb-4">Search Results</h1>
          <div className="flex justify-between mb-4">
            <button
              className="flex items-center text-blue-500 hover:underline"
              onClick={() => setIsMapView(!isMapView)}
            >
              <FaMapMarkerAlt className="mr-2" />
              {isMapView ? 'View List' : 'View Map'}
            </button>
          </div>

          {properties.length === 0 ? (
            <p>No search results found</p>
          ) : isMapView ? (
            // Render Map View using Google Maps
            <div className="h-[500px]">
              <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={defaultCenter}
                  zoom={13}
                >
                  {properties.map((property) => (
                    <Marker
                      key={property._id}
                      position={{
                        lat: parseFloat(property.location.lat),
                        lng: parseFloat(property.location.lng),
                      }}
                    >
                      <InfoWindow>
                        <div>{property.name}</div>
                      </InfoWindow>
                    </Marker>
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          ) : (
            // Render List View
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;
