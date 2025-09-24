import express from 'express';

const PORT = process.env.PORT || 3002;
const app = express();

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

// Start the server.
app.listen(PORT, () => console.log(`Location Service running on port ${PORT}`));

