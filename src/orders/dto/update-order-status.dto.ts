import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderEnum } from '../enums/order-status.enum';

export class UpdateOrederStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderEnum.SHIPPED, OrderEnum.DELIVERED])
  status: OrderEnum;
}
