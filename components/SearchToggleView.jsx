'use client';

import { useState } from 'react';
import PropertyCard from './PropertyCard';
import MapView from './MapView';

const SearchToggleView = ({ properties }) => {
  const [view, setView] = useState('list');

  return (
    <>
      <div className='flex justify-end mb-4'>
        <button
          onClick={() => setView(view === 'list' ? 'map' : 'list')}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Switch to {view === 'list' ? 'Map View' : 'List View'}
        </button>
      </div>

      {properties.length === 0 ? (
        <p>No search results found</p>
      ) : view === 'list' ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <MapView properties={properties} />
      )}
    </>
  );
};

export default SearchToggleView;
