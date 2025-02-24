import { SQSEvent, SQSHandler } from 'aws-lambda';
import {
  DynamoDBClient,
  ConditionalCheckFailedException,
} from '@aws-sdk/client-dynamodb';
import { validateOrder, Order } from '@/entities/order';
import { OrderRepository } from '@/database/repository/orderRepository';

const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const orderRepository = new OrderRepository(
  dynamoDbClient,
  process.env.ORDERS_TABLE
);

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    console.log('Received message:', messageBody);

    const validationResult = validateOrder(messageBody);

    if (!validationResult.success) {
      console.error('Validation Error:', validationResult.error.errors);
      continue;
    }

    const order: Order = validationResult.data;

    try {
      await orderRepository.save(order);
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        console.log(`Order with ID ${order.orderId} already exists. Skipping.`);
      } else {
        console.error('Error saving order:', error);
        throw error;
      }
    }
  }
};
