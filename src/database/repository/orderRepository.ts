import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Order } from '@/entities/order/order.type';
import { IRepository } from '@/database/repository/interface/repository.interface';

export class OrderRepository implements IRepository<Order> {
  private dynamoDbClient: DynamoDBClient;
  private tableName: string;

  constructor(dynamoDbClient: DynamoDBClient) {
    this.dynamoDbClient = dynamoDbClient;
    this.tableName = process.env.ORDERS_TABLE || 'OrdersTable-dev';
  }

  async save(order: Order): Promise<void> {
    const putCommand = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        orderId: { S: order.orderId },
        customerDocument: { S: order.customerDocument },
        items: {
          L: order.items.map((item) => ({
            M: {
              productId: { S: item.productId },
              quantity: { N: item.quantity.toString() },
              unitPrice: { N: item.unitPrice.toString() },
            },
          })),
        },
      },
      ConditionExpression: 'attribute_not_exists(orderId)',
    });

    await this.dynamoDbClient.send(putCommand);
    console.log(`Order ${order.orderId} saved to DynamoDB`);
  }
}
