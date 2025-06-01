'use client';

import { useState } from 'react';

const defaultFilters = {
  type: '',
  beds: '',
  baths: '',
  minSqft: '',
  maxSqft: '',
  amenities: [],
};

const amenityOptions = ['AC', 'WiFi', 'Parking', 'Washer', 'Gym'];

const PropertyFilterSidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
      <h2 className="text-lg font-semibold mb-2">Filters</h2>

      <div>
        <label className="block text-sm font-medium">Property Type</label>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="studio">Studio</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Bedrooms</label>
        <input
          type="number"
          name="beds"
          value={filters.beds}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bathrooms</label>
        <input
          type="number"
          name="baths"
          value={filters.baths}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          min="0"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Min Sqft</label>
          <input
            type="number"
            name="minSqft"
            value={filters.minSqft}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
            min="0"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">Max Sqft</label>
          <input
            type="number"
            name="maxSqft"
            value={filters.maxSqft}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-2 py-1"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center text-sm space-x-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilterSidebar;
