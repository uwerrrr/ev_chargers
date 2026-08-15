import express from 'express';
import { findAvailableChargersByPlugType } from './charger.service';
import { toChargerDto } from './charger.mapper';

// Builds the Express application without starting it, so tests can exercise
// the routes directly (via supertest) without a real database connection.
export function createApp() {
  const app = express();

  // A simple health check endpoint to confirm the service is running.
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // Defines the API endpoint for this service.
  app.get('/chargers/available/:plugType', async (req, res) => {
    try {
      const chargers = await findAvailableChargersByPlugType(req.params.plugType);
      // Map database models to DTOs before sending the response.
      res.status(200).json(chargers.map(toChargerDto));
    } catch (error) {
      console.error('[charger-service] Error fetching available chargers:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  return app;
}
