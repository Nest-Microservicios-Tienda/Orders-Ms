import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatusDto } from './dto/change-status.dto';

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
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }
  @MessagePattern('changeOrderStatus')
  changeOrdersStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.orderService.changeOrderStatus(changeOrderStatusDto);
  }
}
