const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Transforms backend location rows to the shape used by dbms2 components
function transformLocation(l) {
  return {
    id:          l.location_id,
    location_id: l.location_id,
    name:        l.city,
    city:        l.city,
    province:    l.province,
    street:      l.street,
    postalCode:  l.postal_code,
    postal_code: l.postal_code,
    lat:         l.lat   || null,
    lng:         l.lng   || null,
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
