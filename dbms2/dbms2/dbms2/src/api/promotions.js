// API placeholder — swap function body for real fetch when backend is ready
import promotions from '../data/promotions.js';

export async function getPromotions() {
  try {
    return { data: promotions, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function getActivePromotion() {
  try {
    const active = promotions.find((p) => p.active) ?? null;
    return { data: active, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
