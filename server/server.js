import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';

const port = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

connectDB();

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});
