import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock the shared axios instance so tests never make real network calls.
// vi.mock is hoisted above imports, so config.ts's CHARGER_SERVICE/etc. defaults
// (which read process.env at import time) are still exercised normally; only
// httpClient.get is replaced.
vi.mock('./config', async () => {
  const actual = await vi.importActual<typeof import('./config')>('./config');
  return {
    ...actual,
    httpClient: { get: vi.fn() },
  };
});

import { createApp } from './app';
import { httpClient } from './config';

const mockedGet = httpClient.get as unknown as ReturnType<typeof vi.fn>;

describe('api-gateway', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  describe('GET /health', () => {
    it('returns 200 and status ok', async () => {
      const app = createApp();
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /chargers/available/:plugType', () => {
    it('forwards the plug type to the charger service and returns its payload', async () => {
      const payload = [{ id: 101, location: 'Sydney CBD Carpark', status: 'available' }];
      mockedGet.mockResolvedValueOnce({ data: payload });

      const app = createApp();
      const res = await request(app).get('/chargers/available/CCS2');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(payload);
      expect(mockedGet).toHaveBeenCalledWith(
        expect.stringContaining('/chargers/available/CCS2')
      );
    });

    it('propagates a downstream 404 instead of reporting a generic 500', async () => {
      mockedGet.mockRejectedValueOnce({ response: { status: 404, data: {} } });

      const app = createApp();
      const res = await request(app).get('/chargers/available/Unknown');

      expect(res.status).toBe(404);
    });

    it('returns 504 when the downstream call times out', async () => {
      mockedGet.mockRejectedValueOnce({ code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' });

      const app = createApp();
      const res = await request(app).get('/chargers/available/CCS2');

      expect(res.status).toBe(504);
    });

    it('returns 502 when the downstream service cannot be reached', async () => {
      mockedGet.mockRejectedValueOnce({ code: 'ECONNREFUSED', message: 'connect ECONNREFUSED' });

      const app = createApp();
      const res = await request(app).get('/chargers/available/CCS2');

      expect(res.status).toBe(502);
    });
  });

  describe('GET /charger-status/:id', () => {
    it('rejects a non-numeric id with 400 instead of a null chargerId', async () => {
      const app = createApp();
      const res = await request(app).get('/charger-status/abc');

      expect(res.status).toBe(400);
      expect(mockedGet).not.toHaveBeenCalled();
    });

    it('rejects an id with a numeric prefix but trailing garbage', async () => {
      const app = createApp();
      const res = await request(app).get('/charger-status/12abc');

      expect(res.status).toBe(400);
    });

    it('combines location and status responses for a valid numeric id', async () => {
      mockedGet
        .mockResolvedValueOnce({ data: { location: 'Charger 1 Location', address: '123 Power St, Sydney' } })
        .mockResolvedValueOnce({ data: { status: 'available', powerOutput: '50kW' } });

      const app = createApp();
      const res = await request(app).get('/charger-status/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        chargerId: 1,
        location: 'Charger 1 Location',
        address: '123 Power St, Sydney',
        status: 'available',
        powerOutput: '50kW',
      });
    });

    it('returns 500 when a downstream call fails without a recognizable cause', async () => {
      mockedGet.mockRejectedValueOnce(new Error('boom'));

      const app = createApp();
      const res = await request(app).get('/charger-status/1');

      expect(res.status).toBe(500);
    });
  });

  describe('unmatched routes', () => {
    it('returns 404 for an unknown path', async () => {
      const app = createApp();
      const res = await request(app).get('/does-not-exist');
      expect(res.status).toBe(404);
    });
  });
});
