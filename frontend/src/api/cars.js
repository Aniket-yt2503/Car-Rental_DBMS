const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Cars ──────────────────────────────────────────────────────────────────────
// Transforms backend snake_case to the camelCase shape used by dbms2 components
function transformCar(c) {
  return {
    id:           c.car_id,
    car_id:       c.car_id,
    make:         c.make,
    model:        c.model,
    year:         c.year_made,
    year_made:    c.year_made,
    color:        c.color,
    licensePlate: c.license_plate,
    license_plate:c.license_plate,
    carClass:     c.class_name ? c.class_name.charAt(0).toUpperCase() + c.class_name.slice(1).toLowerCase() : 'Compact',
    class_name:   c.class_name,
    locationId:   c.location_id,
    location_id:  c.location_id,
    pricePerDay:  Number(c.price_per_day || 0),
    price_per_day:Number(c.price_per_day || 0),
    imageUrl:     c.image_url || null,
  };
}

export async function getCars() {
  try {
    const res = await fetch(`${API_URL}/cars`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    return { data: raw.map(transformCar), error: null };
  } catch (error) {
    console.error('[getCars]', error);
    return { data: [], error: error.message };
  }
}
