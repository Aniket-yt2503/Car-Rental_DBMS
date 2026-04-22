// API placeholder — swap function body for real fetch when backend is ready
import locations from '../data/locations.js';

export async function getLocations() {
  try {
    return { data: locations, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
