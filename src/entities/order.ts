import { z } from 'zod';

export const OrderSchema = z.object({
  orderId: z.string(),
  customerDocument: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(0),
      unitPrice: z.number().min(0),
    })
  ),
});

export type Order = z.infer<typeof OrderSchema>;

export const validateOrder = (body) => {
  return OrderSchema.safeParse(body);
};
