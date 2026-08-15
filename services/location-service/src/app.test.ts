import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app';

describe('location-service', () => {
  it('GET /health returns 200 and status ok', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /locations/:id echoes the id into the mock location payload', async () => {
    const app = createApp();
    const res = await request(app).get('/locations/42');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      location: 'Charger 42 Location',
      address: '123 Power St, Sydney',
    });
  });
});
