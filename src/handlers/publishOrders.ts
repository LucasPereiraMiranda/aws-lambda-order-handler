import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Order } from '@/entities/order/order.type';
import { validateOrder } from '@/entities/order/order.validation';
import { Queue } from '@/services/queue';

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const orderQueue = new Queue(sqsClient, process.env.QUEUE_URL);

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body);
  const validationResult = validateOrder(body);

  if (!validationResult.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Validation failed',
        errors: validationResult.error.format(),
      }),
    };
  }

  const order: Order = validationResult.data;

  const messageId = await orderQueue.enqueue(order);
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Message sent successfully!',
      messageId,
    }),
  };
};
