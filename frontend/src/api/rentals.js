const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create a new rental in the live database.
 * The BookingSystem passes a bookingResult object — we map it to the
 * backend POST /api/rentals payload.
 */
export async function createRental(bookingResult) {
  try {
    const payload = {
      customer_id:      bookingResult.customerId  || bookingResult.customer_id || 10,
      car_id:           bookingResult.carId        || bookingResult.car_id,
      rent_location_id: parseInt((bookingResult.pickupLocationId || bookingResult.rent_location_id || '').toString().replace('LOC-', ''), 10),
      requested_class:  (bookingResult.requestedClass || bookingResult.carClass || 'compact').toLowerCase(),
      start_date:       bookingResult.pickupDate   || new Date().toISOString().split('T')[0],
      odometer_before:  bookingResult.startOdometer || 0,
      promo_id:         bookingResult.promoId      || null,
    };

    const res = await fetch(`${API_URL}/rentals`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { data: { id: data.id, ...payload }, error: null };
  } catch (error) {
    console.error('[createRental]', error);
    return { data: null, error: error.message };
  }
}
