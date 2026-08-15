import express, { NextFunction, Request, Response } from 'express';
import { CHARGER_SERVICE, LOCATION_SERVICE, STATUS_SERVICE, httpClient } from './config';
import { handleDownstreamError } from './errors';

// Builds the Express application without starting it, so tests can exercise
// the routes directly (via supertest) without binding a real port.
export function createApp() {
  const app = express();

  // --- Public API Routes ---

  // A simple health check endpoint to confirm the service is running.
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // Forwards the request to the Charger Service to find available chargers.
  // GET: find charger by plug type
  app.get('/chargers/available/:plugType', async (req, res) => {
    try {
      const response = await httpClient.get(
        `${CHARGER_SERVICE}/chargers/available/${req.params.plugType}`
      );
      res.status(200).json(response.data);
    } catch (error) {
      handleDownstreamError(res, error, 'fetching available chargers');
    }
  });

  // Fetches data from location service and status in parallel and combines the results.
  app.get('/charger-status/:id', async (req, res) => {
    const chargerId = req.params.id;

    // Reject anything that isn't a plain positive integer up front, rather than
    // silently forwarding it to two services and returning a null chargerId.
    if (!/^\d+$/.test(chargerId)) {
      res.status(400).json({ message: `Invalid charger id: ${chargerId}` });
      return;
    }

    try {
      // Use Promise.all to make concurrent requests for better performance.
      const [locationRes, statusRes] = await Promise.all([
        httpClient.get(`${LOCATION_SERVICE}/locations/${chargerId}`),
        httpClient.get(`${STATUS_SERVICE}/status/${chargerId}`),
      ]);

      // Combine responses into a single object for the client.
      const combinedStatus = {
        chargerId: parseInt(chargerId, 10),
        ...locationRes.data,
        ...statusRes.data,
      };
      res.status(200).json(combinedStatus);
    } catch (error) {
      handleDownstreamError(res, error, 'fetching charger status');
    }
  });

  // Anything that doesn't match a route above.
  app.use((req, res) => {
    res.status(404).json({ message: `Not found: ${req.method} ${req.path}` });
  });

  // Final error-handling middleware, in case a route handler throws synchronously.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[api-gateway] Unhandled error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  return app;
}
