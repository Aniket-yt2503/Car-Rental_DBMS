// API placeholder — swap function body for real fetch when backend is ready
import cars from '../data/cars.js';

export async function getCars() {
  try {
    return { data: cars, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
