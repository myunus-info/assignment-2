import { Order } from './order.model';
import { IOrder } from './order.interface';

const createOne = async (orderData: IOrder): Promise<IOrder> => {
  const result = await Order.create(orderData);

  return result;
};

const calculateRevenue = async (): Promise<number> => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  return result[0]?.totalRevenue || 0;
};

export const OrderServices = {
  createOne,
  calculateRevenue,
};
