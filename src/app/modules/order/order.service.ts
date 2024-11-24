import { Order } from './order.model';
import { IOrder } from './order.interface';

const createOne = async (orderData: IOrder): Promise<IOrder> => {
  const result = await Order.create(orderData);

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
  calculateRevenue,
};
