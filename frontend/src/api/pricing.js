// API placeholder — swap function body for real fetch when backend is ready
import pricing, { DROP_OFF_CHARGE } from '../data/pricing.js';

export async function getPricing() {
  try {
    return { data: pricing, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function getDropOffCharge() {
  try {
    return { data: DROP_OFF_CHARGE, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
