import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto } from './dto/change-status.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrderService');
  constructor(
    @Inject('PRODUCTS_MS') private readonly productsClient: ClientProxy,
  ) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Base de datos de Orders conectada');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      //1 Confirmar los ids de los productos
      const productIds = createOrderDto.items.map((item) => item.productId);
      const products: any[] = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_id' }, productIds),
      );

      //2. Cálculos de los valores
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;
        return price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      //3. Crear una transacción de base de datos
      const order = await this.order.create({
        data: {
          totalAumont: totalAmount,
          totalItem: totalItems,
          orderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          orderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItem: order.orderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `El error es ${error}`,
        error,
      });
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: string) {
    const order = this.order.findFirst({
      where: { id },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with ${id} not found`,
      });
    }

    return order;
  }

  async changeOrderStatus(changeOrderStatus: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatus;
    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }
    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}
