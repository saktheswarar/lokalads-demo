'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import PropertyCard from '@/components/PropertyCard';
import PropertySearchForm from '@/components/PropertySearchForm';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import MapView from '@/components/MapView';
import PropertyFilterSidebar from '@/components/PropertyFilterSidebar';

const SearchResultsPageClient = ({ properties }) => {
  const [view, setView] = useState('list'); // list | map
  const [filters, setFilters] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState(properties || []);

  useEffect(() => {
    if (!filters) return setFilteredProperties(properties);

    const applyFilters = () => {
      const {
        type,
        beds,
        baths,
        minSqft,
        maxSqft,
        amenities,
      } = filters;

      const result = properties.filter((property) => {
        const matchesType = type ? property.type === type : true;
        const matchesBeds = beds ? +property.bedrooms >= +beds : true;
        const matchesBaths = baths ? +property.bathrooms >= +baths : true;
        const matchesMinSqft = minSqft ? +property.sqft >= +minSqft : true;
        const matchesMaxSqft = maxSqft ? +property.sqft <= +maxSqft : true;

        const matchesAmenities =
          amenities && amenities.length > 0
            ? amenities.every((a) => property.amenities?.includes(a))
            : true;

        return (
          matchesType &&
          matchesBeds &&
          matchesBaths &&
          matchesMinSqft &&
          matchesMaxSqft &&
          matchesAmenities
        );
      });

      setFilteredProperties(result);
    };

    applyFilters();
  }, [filters, properties]);

  if (!properties) return <p>Loading...</p>;

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

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl">Search Results</h1>

            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(val) => {
                if (val) setView(val);
              }}
              className="space-x-2"
            >
              <ToggleGroupItem value="list">List View</ToggleGroupItem>
              <ToggleGroupItem value="map">Map View</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-1/4">
              <PropertyFilterSidebar onFilterChange={setFilters} />
            </aside>

            <main className="w-full lg:w-3/4">
              {filteredProperties.length === 0 ? (
                <p>No search results found</p>
              ) : view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              ) : (
                <MapView properties={filteredProperties} />
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResultsPageClient;
