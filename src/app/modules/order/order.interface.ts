import { Types } from 'mongoose';

export interface IOrder {
  email: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
}
