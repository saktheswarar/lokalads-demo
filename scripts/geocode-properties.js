// scripts/geocode-properties.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Property from '../models/Property.js'; // adjust path based on your structure
import connectDB from '../config/database.js';

dotenv.config();

const geocodeAddress = async (address) => {
  const encodedAddress = encodeURIComponent(address);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error('Geocoding failed:', data.status, address);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error.message);
    return null;
  }
};

const updateMissingCoordinates = async () => {
  await connectDB();

  const properties = await Property.find({
    $or: [
      { 'location.coordinates': { $exists: false } },
      { 'location.coordinates.lat': { $exists: false } },
      { 'location.coordinates.lng': { $exists: false } },
    ],
  });

  console.log(`Found ${properties.length} properties with missing coordinates.`);

  for (const property of properties) {
    const address = `${property.location?.address || ''}, ${property.location?.city || ''}, ${property.location?.state || ''}, ${property.location?.zipcode || ''}`;
    const coords = await geocodeAddress(address);

    if (coords) {
      property.location.coordinates = {
        lat: coords.lat,
        lng: coords.lng,
      };
      await property.save();
      console.log(`Updated property ${property._id} with lat/lng: ${coords.lat}, ${coords.lng}`);
    }
  }

  console.log('Finished updating missing coordinates.');
  mongoose.connection.close();
};

updateMissingCoordinates();
