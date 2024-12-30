import express from 'express';
import appRoutes from './routes';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*' }));

// Routes
app.use(appRoutes);

export default app;
