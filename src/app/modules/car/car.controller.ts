/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { CarServices } from './car.service';
import carValidationSchema from './car.validation';
import giveGenericErrorResponse from '../../errors/genericError';

const createCar = async (req: Request, res: Response) => {
  try {
    const zodParsedCarData = carValidationSchema.parse(req.body);
    const car = await CarServices.createOne(zodParsedCarData);

    res.status(201).json({
      message: 'Car created successfully',
      success: true,
      data: car,
    });
  } catch (error: any) {
    giveGenericErrorResponse(error, res);
  }
};

const getAllCars = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    const search = typeof searchTerm === 'string' ? searchTerm : '';

    const cars = await CarServices.fetchAll(search);

    if (cars.length < 1) {
      res.status(404).json({ message: 'No car found!' });
    } else {
      res.status(200).json({
        message: 'Cars retrieved successfully',
        success: true,
        data: cars,
      });
    }
  } catch (error: any) {
    giveGenericErrorResponse(error, res);
  }
};

const getASpecificCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;

    const car = await CarServices.fetchOne(carId);

    if (!car) {
      res.status(400).json({ message: `No car found with id: ${carId}` });
    } else {
      res.status(200).json({
        message: 'Car retrieved successfully',
        success: true,
        data: car,
      });
    }
  } catch (error: any) {
    giveGenericErrorResponse(error, res);
  }
};

const updateACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const carUpdates = req.body;

    const carUpdatesValidationSchema = carValidationSchema.partial();

    const zodParsedCarUpdatesData =
      carUpdatesValidationSchema.parse(carUpdates);

    const updatedCar = await CarServices.updateOne(
      carId,
      zodParsedCarUpdatesData,
    );

    res.status(200).json({
      message: 'Car updated successfully',
      success: true,
      data: updatedCar,
    });
  } catch (error: any) {
    giveGenericErrorResponse(error, res);
  }
};

const deleteACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;

    await CarServices.deleteOne(carId);

    res.status(200).json({
      message: 'Car deleted successfully',
      success: true,
      data: {},
    });
  } catch (error: any) {
    giveGenericErrorResponse(error, res);
  }
};

export const CarControllers = {
  createCar,
  getAllCars,
  getASpecificCar,
  updateACar,
  deleteACar,
};
