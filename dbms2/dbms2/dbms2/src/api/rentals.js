// API placeholder — swap function body for real fetch when backend is ready
export async function createRental(bookingResult) {
  try {
    console.log('[createRental] booking:', bookingResult);
    return { data: { id: 'RENTAL-' + Date.now(), ...bookingResult }, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
