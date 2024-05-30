import { Type } from 'class-transformer';
import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { OrderItemsDto } from './order-items';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) //para validar internamente los valores que traemos
  @Type(() => OrderItemsDto)
  items: OrderItemsDto[];
}
