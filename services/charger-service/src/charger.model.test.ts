import { describe, it, expect } from 'vitest';
import { ChargerModel } from './charger.model';

// These exercise Mongoose's local schema validation (validateSync/validate),
// which runs without a live database connection.
describe('ChargerModel validation', () => {
  it('accepts a charger with a known, non-empty plug type list', () => {
    const charger = new ChargerModel({
      id: 1,
      location: 'Sydney CBD Carpark',
      status: 'available',
      supportedPlugTypes: ['CCS2'],
    });

    expect(charger.validateSync()).toBeUndefined();
  });

  it('rejects an empty supportedPlugTypes array', () => {
    const charger = new ChargerModel({
      id: 2,
      location: 'Sydney CBD Carpark',
      status: 'available',
      supportedPlugTypes: [],
    });

    const error = charger.validateSync();
    expect(error?.errors.supportedPlugTypes?.message).toMatch(/at least one plug type/);
  });

  it('rejects a plug type outside the known enum', () => {
    const charger = new ChargerModel({
      id: 3,
      location: 'Sydney CBD Carpark',
      status: 'available',
      supportedPlugTypes: ['NotAPlugType'],
    });

    const error = charger.validateSync();
    expect(error?.errors['supportedPlugTypes.0']).toBeDefined();
  });

  it('rejects a status outside the known enum', () => {
    const charger = new ChargerModel({
      id: 4,
      location: 'Sydney CBD Carpark',
      status: 'broken',
      supportedPlugTypes: ['CCS2'],
    });

    const error = charger.validateSync();
    expect(error?.errors.status).toBeDefined();
  });
});
