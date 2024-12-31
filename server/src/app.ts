import express from 'express';
import appRoutes from './routes';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*' }));

// Routes
app.use(appRoutes);

// Error handler
app.use(errorHandler);

export default app;
