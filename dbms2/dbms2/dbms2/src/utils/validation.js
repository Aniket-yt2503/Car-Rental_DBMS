/**
 * Validates the booking widget form data.
 * @param {Object} formData
 * @param {string} formData.pickupLocation
 * @param {string} formData.returnLocation
 * @param {string} formData.pickupDate
 * @param {string} formData.returnDate
 * @param {string} formData.requestedClass
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateBookingForm(formData) {
  const { pickupLocation, returnLocation, pickupDate, returnDate } = formData || {};
  const errors = {};

  if (!pickupLocation || typeof pickupLocation !== 'string' || pickupLocation.trim() === '') {
    errors.pickupLocation = 'Please select a pickup location';
  }

  if (!returnLocation || typeof returnLocation !== 'string' || returnLocation.trim() === '') {
    errors.returnLocation = 'Please select a return location';
  }

  if (!pickupDate) {
    errors.pickupDate = 'Please select a pickup date';
  }

  if (!returnDate) {
    errors.returnDate = 'Please select a return date';
  } else if (pickupDate && new Date(returnDate) <= new Date(pickupDate)) {
    errors.returnDate = 'Return date must be after pickup date';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates odometer readings.
 * @param {number} start - Starting odometer value
 * @param {number} end - Ending odometer value
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateOdometer(start, end) {
  if (end < start) {
    return { valid: false, error: 'End odometer must be ≥ start odometer' };
  }
  return { valid: true, error: null };
}
