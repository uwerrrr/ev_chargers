import express from 'express';

// Builds the Express application without starting it, so tests can exercise
// the routes directly (via supertest) without binding a real port.
export function createApp() {
  const app = express();

  // A simple health check endpoint to confirm the service is running.
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // Defines the API endpoint for this service.
  app.get('/locations/:id', (req, res) => {
    const chargerId = req.params.id;
    console.log(`[LocationService] Request received for charger ${chargerId}`);
    // Simulate a 50ms delay for a network call or database lookup.
    setTimeout(() => {
      // Return mock static data.
      res.json({ location: `Charger ${chargerId} Location`, address: '123 Power St, Sydney' });
    }, 50);
  });

  return app;
}
