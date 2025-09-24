import express from 'express';
import { connectDB } from './database';
import { findAvailableChargersByPlugType, seedDatabase } from './charger.service';
import { toChargerDto } from './charger.mapper';

const PORT = process.env.PORT || 3001;
const app = express();

// Main function to initialize and start the server.
async function startServer() {
  await connectDB();
  await seedDatabase();

  // Defines the API endpoint for this service.
  app.get('/chargers/available/:plugType', async (req, res) => {
    try {
      const chargers = await findAvailableChargersByPlugType(req.params.plugType);
      // Map database models to DTOs before sending the response.
      res.status(200).json(chargers.map(toChargerDto));
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.listen(PORT, () => console.log(`Charger Service running on port ${PORT}`));
}

startServer();

