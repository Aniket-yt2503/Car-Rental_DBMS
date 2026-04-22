const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch promotions from the live backend.
 * Falls back to empty array on error.
 */
export async function getPromotions() {
  try {
    const res = await fetch(`${API_URL}/promotions`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    // Normalize to what BookingSystem expects
    const data = raw.map((p, idx) => ({
      id:              p.promo_id,
      promo_id:        p.promo_id,
      code:            `PROMO${p.promo_id}`,
      promo_code:      `PROMO${p.promo_id}`,
      carClass:        p.class_name ? p.class_name.charAt(0).toUpperCase() + p.class_name.slice(1) : null,
      class_name:      p.class_name,
      discountPercent: Number(p.discount_pct || 0),
      discount_pct:    Number(p.discount_pct || 0),
      label:           `Weekly Deal on ${p.class_name ? p.class_name.charAt(0).toUpperCase() + p.class_name.slice(1) : 'all'} cars`,
      active:          idx === 0, // Make the first one active by default so it shows up
    }));
    return { data, error: null };
  } catch (error) {
    console.error('[getPromotions]', error);
    return { data: [], error: error.message };
  }
}

export async function getActivePromotion() {
  const result = await getPromotions();
  if (result.error) return { data: null, error: result.error };
  const active = result.data.find(p => p.active) ?? null;
  return { data: active, error: null };
}
