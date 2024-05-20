import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}
  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  @MessagePattern('findAllOrders')
  findAll() {
    return this.orderService.findAll();
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('Id') id: number) {
    return this.orderService.findOne(id);
  }
  @MessagePattern('changeOrderStatus')
  changeOrdersStatus() {}
}
