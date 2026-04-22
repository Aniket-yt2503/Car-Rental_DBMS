const UNIT_DAYS = {
  month: 30,
  '2weeks': 14,
  week: 7,
  day: 1,
};

/**
 * Greedy decomposition of total days into billing units.
 * @param {number} n - total rental days
 * @returns {{ unit: string, quantity: number, unitDays: number }[]}
 */
export function decomposeDays(n) {
  const months = Math.floor(n / 30);
  let remainder = n % 30;

  const twoWeeks = Math.floor(remainder / 14);
  remainder = remainder % 14;

  const weeks = Math.floor(remainder / 7);
  const days = remainder % 7;

  return [
    { unit: 'month',  quantity: months,   unitDays: UNIT_DAYS.month   },
    { unit: '2weeks', quantity: twoWeeks, unitDays: UNIT_DAYS['2weeks'] },
    { unit: 'week',   quantity: weeks,    unitDays: UNIT_DAYS.week    },
    { unit: 'day',    quantity: days,     unitDays: UNIT_DAYS.day     },
  ].filter((line) => line.quantity > 0);
}

/**
 * Returns billing lines enriched with unitPrice and subtotal for display.
 * @param {number} totalDays
 * @param {object} pricingEntry - PricingEntry from data/pricing.js
 * @returns {{ unit, quantity, unitDays, unitPrice, subtotal }[]}
 */
export function getBillingLines(totalDays, pricingEntry) {
  const rateMap = {
    month:   pricingEntry.perMonth,
    '2weeks': pricingEntry.per2Weeks,
    week:    pricingEntry.perWeek,
    day:     pricingEntry.perDay,
  };

  return decomposeDays(totalDays).map((line) => {
    const unitPrice = rateMap[line.unit];
    return {
      ...line,
      unitPrice,
      subtotal: line.quantity * unitPrice,
    };
  });
}

/**
 * Calculates the final rental price applying mode-based discounts.
 * @param {number} totalDays
 * @param {object} pricingEntry
 * @param {object|null} promotion
 * @param {'customer'|'employee'} mode
 * @returns {number} finalPrice rounded to 2 decimal places
 */
export function calculatePrice(totalDays, pricingEntry, promotion, mode) {
  const basePrice = getBillingLines(totalDays, pricingEntry).reduce(
    (sum, line) => sum + line.subtotal,
    0
  );

  let finalPrice = basePrice;

  if (mode === 'employee') {
    finalPrice = totalDays < 14 ? basePrice * 0.50 : basePrice * 0.90;
  } else {
    // customer mode
    if (
      promotion !== null &&
      promotion !== undefined &&
      promotion.carClass === pricingEntry.carClass
    ) {
      finalPrice = basePrice * (1 - promotion.discountPercent / 100);
    }
  }

  return Math.round(finalPrice * 100) / 100;
}

/**
 * Returns the drop-off fee when pickup and return locations differ.
 * @param {string} pickupLocationId
 * @param {string} returnLocationId
 * @param {number} dropOffFee
 * @returns {number|null}
 */
export function getDropOffCharge(pickupLocationId, returnLocationId, dropOffFee) {
  return pickupLocationId !== returnLocationId ? dropOffFee : null;
}
