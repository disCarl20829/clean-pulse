const env = require('../config/env');

/**
 * Reverse geocode lat/lng into a human-readable Philippine address
 * (barangay/neighborhood, city/municipality, province) using
 * Mapbox's Geocoding API v6.
 */
async function reverseGeocode(lat, lng) {
  const url = new URL('https://api.mapbox.com/search/geocode/v6/reverse');
  url.searchParams.set('longitude', lng);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('access_token', env.mapboxAccessToken);
  url.searchParams.set('language', 'en');
  url.searchParams.set('country', 'PH');

  const res = await fetch(url.toString());
  const data = await res.json();

  const feature = data.features?.[0];
  if (!feature) {
    return { formattedAddress: null, barangay: null, city: null, province: null };
  }

  const context = feature.properties?.context || {};

  return {
    formattedAddress: feature.properties?.full_address || feature.properties?.name || null,
    barangay: context.neighborhood?.name || context.locality?.name || null,
    city: context.place?.name || context.district?.name || null,
    province: context.region?.name || null,
  };
}

module.exports = { reverseGeocode };
