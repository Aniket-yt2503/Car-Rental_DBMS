const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import staticCars from '../data/cars.js';

// ── Cars ──────────────────────────────────────────────────────────────────────
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
  "https://images.unsplash.com/photo-1503376712353-338221081541?w=800&q=80",
  "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
  "https://images.unsplash.com/photo-1555652736-e92021d28a10?w=800&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
  "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80"
];

// Transforms backend snake_case to the camelCase shape used by dbms2 components
function transformCar(c) {
  // Find matching static car by make and model
  let staticCar = staticCars.find(sc => sc.make === c.make && sc.model === c.model);
  
  // If not exactly matching, pick a deterministic image based on car_id
  const carIdNum = parseInt(c.car_id, 10) || 0;
  const uniqueFallbackImage = FALLBACK_IMAGES[carIdNum % FALLBACK_IMAGES.length];
  
  // Features fallback
  let staticFeatures = staticCar ? staticCar.features : ["Bluetooth", "Backup Camera"];
  let staticSeats = staticCar ? staticCar.seats : 5;
  let staticTransmission = staticCar ? staticCar.transmission : "Automatic";
  let staticFuelType = staticCar ? staticCar.fuelType : "Gasoline";

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
    imageUrl:     (staticCar && staticCar.imageUrl) ? staticCar.imageUrl : uniqueFallbackImage,
    features:     staticFeatures,
    seats:        staticSeats,
    transmission: staticTransmission,
    fuelType:     staticFuelType
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
