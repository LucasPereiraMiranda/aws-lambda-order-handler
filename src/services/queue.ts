import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Order } from '@/entities/order';

export class Queue {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor(sqsClient: SQSClient, queueUrl: string) {
    this.sqsClient = sqsClient;
    this.queueUrl = queueUrl;
  }

  async enqueue(order: Order): Promise<string> {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(order),
    });

    const response = await this.sqsClient.send(command);
    console.log('Message sent successfully:', response.MessageId);
    return response.MessageId!;
  }
}
