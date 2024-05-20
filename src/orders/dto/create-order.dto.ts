import { OrderStatus } from '@prisma/client';
import {
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { OrderStatusList } from 'src/enums/order-enum';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAumont: number;

  @IsNumber()
  @IsPositive()
  totalItem: number;

  @IsEnum(OrderStatusList, {
    message: `Possibles status values are ${OrderStatusList}`,
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;

  @IsOptional()
  @IsBoolean()
  pay: boolean = false;
}
