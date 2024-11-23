import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CarRoutes } from './app/modules/car/car.route';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/cars', CarRoutes);

// welcome route
app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Car Store B4A2V3' });
});

export default app;