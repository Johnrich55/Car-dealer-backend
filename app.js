import express, { json } from 'express';
import routes from './routes/index.js';
// import errorHandler from './middleware/errorHandler';

const app = express();

app.use(json());
app.use('/api', routes);
// app.use(errorHandler);

export default app;