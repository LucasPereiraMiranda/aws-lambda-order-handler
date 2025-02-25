import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { IQueue } from '@/services/interface/queue.interface';

export class Queue<T> implements IQueue<T> {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor(sqsClient: SQSClient, queueUrl: string) {
    this.sqsClient = sqsClient;
    this.queueUrl = queueUrl;
  }

  async enqueue(message: T): Promise<string> {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    });

    const response = await this.sqsClient.send(command);
    console.log('Message sent successfully:', response.MessageId);
    return response.MessageId!;
  }
}
