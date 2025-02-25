import { OrderSchema } from '@/entities/order/order.schema';

export const validateOrder = (body) => {
  return OrderSchema.safeParse(body);
};
