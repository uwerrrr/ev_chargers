import { createApp } from './app';

const PORT = process.env.PORT || 3002;
const app = createApp();

// Start the server.
app.listen(PORT, () => console.log(`Location Service running on port ${PORT}`));
