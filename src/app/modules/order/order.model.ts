import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);
