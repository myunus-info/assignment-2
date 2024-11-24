import { ObjectId } from 'mongodb';
import { Order } from './order.model';
import { Car } from '../car/car.model';
import { IOrder } from './order.interface';

const createOne = async (orderData: IOrder): Promise<IOrder> => {
  const result = await Order.create(orderData);

  return result;
};

const getCarById = async (carId: ObjectId) => {
  const result = await Car.findById(carId);

  return result;
};

const reduceCarQuantity = async (carId: ObjectId, quantity: number) => {
  const result = await Car.findByIdAndUpdate(
    carId,
    {
      $inc: { quantity: -quantity },
    },
    { new: true },
  );

  return result;
};

const calculateRevenue = async () => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'carDetails',
      },
    },
    { $unwind: '$carDetails' },
    {
      $addFields: {
        totalOrderPrice: { $multiply: ['$carDetails.price', '$quantity'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: '$totalOrderPrice',
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);
  return result[0]?.totalRevenue || 0;
};

export const OrderServices = {
  createOne,
  getCarById,
  reduceCarQuantity,
  calculateRevenue,
};
