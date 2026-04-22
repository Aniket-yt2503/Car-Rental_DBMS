const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import staticLocations from '../data/locations.js';

// Transforms backend location rows to the shape used by dbms2 components
function transformLocation(l) {
  // Find matching static location by city to get rich data (lat/lng, etc)
  const staticLoc = staticLocations.find(sl => sl.city === l.city) || {};

  return {
    id:          l.location_id,
    location_id: l.location_id,
    name:        staticLoc.name || l.city,
    city:        l.city,
    province:    l.province,
    streetAddress: l.street,
    street:      l.street,
    postalCode:  l.postal_code,
    postal_code: l.postal_code,
    lat:         staticLoc.lat || 0,
    lng:         staticLoc.lng || 0,
    phone:       staticLoc.phone || null,
    hours:       staticLoc.hours || null,
  };
}

export async function getLocations() {
  try {
    const res = await fetch(`${API_URL}/locations`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    return { data: raw.map(transformLocation), error: null };
  } catch (error) {
    console.error('[getLocations]', error);
    return { data: [], error: error.message };
  }
}
