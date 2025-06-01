// app/properties/search-results/page.jsx
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import SearchResultsPageClient from './SearchResultsPageClient';

const SearchResultsPage = async ({ searchParams: { location, propertyType } }) => {
  await connectDB();

  const query = {
    $or: [],
  };

  if (location) {
    const locationPattern = new RegExp(location, 'i');
    query.$or.push(
      { name: locationPattern },
      { description: locationPattern },
      { 'location.address': locationPattern }
    );
  }

  if (propertyType && propertyType !== 'All') {
    query.type = new RegExp(propertyType, 'i');
  }

  const finalQuery = query.$or.length > 0 ? query : { type: query.type || undefined };

  const propertiesQueryResults = await Property.find(finalQuery).lean();
  const properties = convertToSerializeableObject(propertiesQueryResults);

  return <SearchResultsPageClient properties={properties} />;
};

export default SearchResultsPage;
