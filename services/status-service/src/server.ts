import { createApp } from './app';

const PORT = process.env.PORT || 3003;
const app = createApp();

// Start the server.
app.listen(PORT, () => console.log(`Status Service running on port ${PORT}`));
