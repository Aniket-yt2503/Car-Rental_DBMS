import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateBookingForm, validateOdometer } from './validation.js';

// --- Unit tests: validateBookingForm ---

describe('validateBookingForm', () => {
  const valid = {
    pickupLocation: 'LOC-001',
    returnLocation: 'LOC-002',
    pickupDate: '2025-08-01',
    returnDate: '2025-08-05',
    requestedClass: 'Sedan',
  };

  it('returns valid for a correct form', () => {
    const result = validateBookingForm(valid);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('errors when pickupLocation is empty', () => {
    const result = validateBookingForm({ ...valid, pickupLocation: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.pickupLocation).toBeDefined();
  });

  it('errors when returnLocation is empty', () => {
    const result = validateBookingForm({ ...valid, returnLocation: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.returnLocation).toBeDefined();
  });

  it('errors when pickupDate is empty', () => {
    const result = validateBookingForm({ ...valid, pickupDate: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.pickupDate).toBeDefined();
  });

  it('errors when returnDate is empty', () => {
    const result = validateBookingForm({ ...valid, returnDate: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.returnDate).toBeDefined();
  });

  it('errors when returnDate equals pickupDate', () => {
    const result = validateBookingForm({ ...valid, pickupDate: '2025-08-01', returnDate: '2025-08-01' });
    expect(result.valid).toBe(false);
    expect(result.errors.returnDate).toBeDefined();
  });

  it('errors when returnDate is before pickupDate', () => {
    const result = validateBookingForm({ ...valid, pickupDate: '2025-08-05', returnDate: '2025-08-01' });
    expect(result.valid).toBe(false);
    expect(result.errors.returnDate).toBeDefined();
  });

  it('only includes error keys for invalid fields', () => {
    const result = validateBookingForm({ ...valid, pickupLocation: '' });
    expect(Object.keys(result.errors)).toEqual(['pickupLocation']);
  });
});

// --- Unit tests: validateOdometer ---

describe('validateOdometer', () => {
  it('returns valid when end equals start', () => {
    const result = validateOdometer(1000, 1000);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns valid when end is greater than start', () => {
    const result = validateOdometer(1000, 1500);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns invalid when end is less than start', () => {
    const result = validateOdometer(1500, 1000);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('End odometer must be ≥ start odometer');
  });

  it('returns invalid for zero start and negative end', () => {
    const result = validateOdometer(0, -1);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('End odometer must be ≥ start odometer');
  });
});

// --- Property-based tests ---

// Feature: car-rental-frontend, Property 2: Date validation rejects invalid ranges
// Validates: Requirements 4.8
describe('P2: Date validation rejects invalid ranges', () => {
  it('always returns an error when returnDate <= pickupDate', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
        (d1, d2) => {
          const pickup = d1 <= d2 ? d1 : d2;
          const ret = d1 <= d2 ? d2 : d1;
          // Make returnDate <= pickupDate by swapping so ret <= pickup
          const pickupStr = ret.toISOString().slice(0, 10);
          const returnStr = pickup.toISOString().slice(0, 10);

          // Only test cases where return <= pickup
          if (new Date(returnStr) > new Date(pickupStr)) return true; // skip valid cases

          const result = validateBookingForm({
            pickupLocation: 'LOC-001',
            returnLocation: 'LOC-002',
            pickupDate: pickupStr,
            returnDate: returnStr,
            requestedClass: 'Sedan',
          });

          return result.valid === false && result.errors.returnDate !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: car-rental-frontend, Property 4: Odometer validation rejects reversed readings
// Validates: Requirements 7.10
describe('P4: Odometer validation rejects reversed readings', () => {
  it('always returns an error when end < start', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000 }),
        fc.integer({ min: 1, max: 1_000_000 }),
        (start, delta) => {
          const end = start - delta; // end is strictly less than start
          const result = validateOdometer(start, end);
          return result.valid === false && result.error === 'End odometer must be ≥ start odometer';
        }
      ),
      { numRuns: 100 }
    );
  });
});
