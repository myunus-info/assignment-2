import express from 'express';
import { CarControllers } from './car.controller';

const router = express.Router();

router.route('/').post(CarControllers.createCar).get(CarControllers.getAllCars);

router
  .route('/:carId')
  .put(CarControllers.updateACar)
  .get(CarControllers.getASpecificCar)
  .delete(CarControllers.deleteACar);

export const CarRoutes = router;
