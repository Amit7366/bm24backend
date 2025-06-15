import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';
import { setupSocketIO } from './app/socket/socket.config';

let server: http.Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('✅ Connected to MongoDB');
    await seedSuperAdmin();
    // ✅ i will added cron job later
        

    server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: [
          'http://localhost:3000',
          'http://localhost:5173',
          'https://your-production-domain.com',
        ],
        credentials: true,
      },
    });

    // ✅ Integrate full socket logic
    setupSocketIO(io);

    server.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

main();

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection. Shutting down...', err);
  if (server) {
    server.close(() => process.exit(1));
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception. Shutting down...', err);
  process.exit(1);
});
