import z from 'zod';
import { OrderSchema } from '@/entities/order/order.schema';

export type Order = z.infer<typeof OrderSchema>;
