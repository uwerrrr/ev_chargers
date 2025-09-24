import express from 'express';

const PORT = process.env.PORT || 3003;
const app = express();

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

// Start the server.
app.listen(PORT, () => console.log(`Status Service running on port ${PORT}`));

