import express from 'express';

// Builds the Express application without starting it, so tests can exercise
// the routes directly (via supertest) without binding a real port.
export function createApp() {
  const app = express();

  // A simple health check endpoint to confirm the service is running.
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // Defines the API endpoint for this service.
  app.get('/status/:id', (req, res) => {
    const chargerId = req.params.id;
    console.log(`[StatusService] Request received for charger ${chargerId}`);
    // Simulate a 100ms delay to represent a slower, real-time data fetch.
    setTimeout(() => {
      // Return mock live data.
      res.json({ status: 'available', powerOutput: '50kW' });
    }, 100);
  });

  return app;
}
