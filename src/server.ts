import app from './app';
import { env } from './config/env';
import { initDb } from './config/db';

const startServer = async () => {
  try {
    await initDb();
    
    app.listen(env.PORT, () => {
      console.log(`âœ… Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('â Œ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
