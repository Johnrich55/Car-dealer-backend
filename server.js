import { createServer } from 'http';
import app from './app.js';
import connectDB from './config/db.js';

// import { port } from './config/config.js';
require('dotenv').config();

const server = createServer(app);




// Start server after DB connection
connectDB().then(() => {
  server.listen(3000, () => {
    console.log(`Server running on port ${port}`);
  });
});