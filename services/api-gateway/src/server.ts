import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 3000;
const app = express();

// Service URLs are injected via environment variables for flexibility.
const CHARGER_SERVICE = process.env.CHARGER_SERVICE_URL;
const LOCATION_SERVICE = process.env.LOCATION_SERVICE_URL;
const STATUS_SERVICE = process.env.STATUS_SERVICE_URL;

// --- Public API Routes ---

// A simple health check endpoint to confirm the service is running.
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Forwards the request to the Charger Service to find available chargers.
// GET: find charger by plug type
app.get('/chargers/available/:plugType', async (req, res) => {
  try {
    const response = await axios.get(`${CHARGER_SERVICE}/chargers/available/${req.params.plugType}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error communicating with Charger Service' });
  }
});

// Fetches data from location service and status in parallel and combines the results.
app.get('/charger-status/:id', async (req, res) => {
  try {
    const chargerId = req.params.id;

    // Use Promise.all to make concurrent requests for better performance.
    const [locationRes, statusRes] = await Promise.all([
      axios.get(`${LOCATION_SERVICE}/locations/${chargerId}`),
      axios.get(`${STATUS_SERVICE}/status/${chargerId}`)
    ]);

    // Combine responses into a single object for the client.
    const combinedStatus = {
      chargerId: parseInt(chargerId),
      ...locationRes.data,
      ...statusRes.data
    };
    res.status(200).json(combinedStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error communicating with downstream services' });
  }
});

// Start the server.
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));

