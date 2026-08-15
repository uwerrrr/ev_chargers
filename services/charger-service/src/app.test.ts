import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// The route handler only depends on findAvailableChargersByPlugType, so mocking
// it out lets these tests run without a MongoDB connection.
vi.mock('./charger.service', () => ({
  findAvailableChargersByPlugType: vi.fn(),
}));

import { createApp } from './app';
import { findAvailableChargersByPlugType } from './charger.service';
import { ICharger } from './charger.model';

const mockedFind = findAvailableChargersByPlugType as unknown as ReturnType<typeof vi.fn>;

describe('charger-service', () => {
  beforeEach(() => {
    mockedFind.mockReset();
  });

  it('GET /health returns 200 and status ok', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /chargers/available/:plugType returns chargers mapped to DTOs', async () => {
    const chargers = [
      { id: 101, location: 'Sydney CBD Carpark', status: 'available', supportedPlugTypes: ['CCS2'] },
    ] as ICharger[];
    mockedFind.mockResolvedValueOnce(chargers);

    const app = createApp();
    const res = await request(app).get('/chargers/available/CCS2');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 101,
        location: 'Sydney CBD Carpark',
        status: 'available',
        supportedPlugTypes: ['CCS2'],
        filteredWithDTO: true,
      },
    ]);
    expect(mockedFind).toHaveBeenCalledWith('CCS2');
  });

  it('GET /chargers/available/:plugType returns 500 when the query fails', async () => {
    mockedFind.mockRejectedValueOnce(new Error('database unavailable'));

    const app = createApp();
    const res = await request(app).get('/chargers/available/CCS2');

    expect(res.status).toBe(500);
  });
});
