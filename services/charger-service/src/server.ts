import { createApp } from './app';
import { connectDB } from './database';
import { seedDatabase } from './charger.service';

const PORT = process.env.PORT || 3001;

// Main function to initialize and start the server.
async function startServer() {
  await connectDB();
  await seedDatabase();

  const app = createApp();
  app.listen(PORT, () => console.log(`Charger Service running on port ${PORT}`));
}

startServer().catch((error) => {
  // Without this, a rejection from seedDatabase() (connectDB already exits on its own
  // failure) becomes an unhandled promise rejection with no diagnostic message.
  console.error('Charger Service failed to start:', error);
  process.exit(1);
});
