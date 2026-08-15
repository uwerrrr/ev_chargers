import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app';

describe('status-service', () => {
  it('GET /health returns 200 and status ok', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /status/:id returns the mock live status payload', async () => {
    const app = createApp();
    const res = await request(app).get('/status/42');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'available', powerOutput: '50kW' });
  });
});
