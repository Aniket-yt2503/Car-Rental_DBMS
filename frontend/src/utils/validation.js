/**
 * Returns today's date string in local YYYY-MM-DD format.
 */
export function getLocalTodayString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a date exactly 1 year from today in local YYYY-MM-DD format.
 */
export function getLocalMaxDateString() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

  const todayStr = getLocalTodayString();
  const maxDateStr = getLocalMaxDateString();

  if (!pickupDate) {
    errors.pickupDate = 'Please select a pickup date';
  } else if (pickupDate < todayStr) {
    errors.pickupDate = 'Pickup date cannot be in the past';
  } else if (pickupDate > maxDateStr) {
    errors.pickupDate = 'Pickup date cannot exceed 1 year in advance';
  }

  if (!returnDate) {
    errors.returnDate = 'Please select a return date';
  } else if (pickupDate) {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    if (returnD <= pickup) {
      errors.returnDate = 'Return date must be after pickup date';
    } else {
      const diffTime = returnD - pickup;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays > 30) {
        errors.returnDate = 'Maximum rental period is 30 days';
      }
    }
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
