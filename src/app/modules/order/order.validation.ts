import { z } from 'zod';
import { ObjectId } from 'mongodb';

const orderValidationSchema = z.object({
  email: z.string().email(),
  car: z
    .string()
    .refine((val) => ObjectId.isValid(val), {
      message: 'Invalid ObjectId format',
    })
    .transform((val) => new ObjectId(val)),
  quantity: z
    .number()
    .int()
    .positive({ message: 'Quantity must be a positive integer' }),
  totalPrice: z
    .number()
    .positive({ message: 'Total price must be a positive number' }),
});

export default orderValidationSchema;
