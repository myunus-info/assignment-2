/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { OrderServices } from './order.service';
import orderValidationSchema from './order.validation';
import giveGenericErrorResponse from '../../errors/genericError';

const createOrder = async (req: Request, res: Response) => {
  try {
    const zodParsedOrderData = orderValidationSchema.parse(req.body);
    zodParsedOrderData.car = new ObjectId(zodParsedOrderData.car);

    const car = await OrderServices.getCarById(zodParsedOrderData.car);
    if (!car || !car.inStock || car.quantity < zodParsedOrderData.quantity) {
      res.status(400).json({
        message: 'Insufficient car quantity available!',
        success: false,
      });
    } else {
      // 1. place order
      const order = await OrderServices.createOne(zodParsedOrderData);
      // 2. reduce quantity
      await OrderServices.reduceCarQuantity(order.car, order.quantity);
      // 3. update inStock property to false if equals to 0
      if (car.quantity - order.quantity === 0) {
        car.inStock = false;
        await car.save();
      }

      res.status(201).json({
        message: 'Order created successfully',
        success: true,
        data: order,
      });
    }
  } catch (error: any) {
    giveGenericErrorResponse(error, res);
  }
};

const calculateRevenueFromOrders = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await OrderServices.calculateRevenue();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: { totalRevenue },
    });
  } catch (error: any) {
    giveGenericErrorResponse(error, res);
  }
};

export const OrderControllers = {
  createOrder,
  calculateRevenueFromOrders,
};
