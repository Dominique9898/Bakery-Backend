import { IsArray, IsNotEmpty, ValidateNested, Min, IsEnum, IsOptional, IsString, ValidateIf, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class OrderProductDto {
  @IsNotEmpty({ message: '商品ID不能为空' })
  productId!: string;

  @Min(1, { message: '商品数量必须大于0' })
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products!: OrderProductDto[];

  @IsEnum(['pickup', 'delivery'])
  @IsNotEmpty({ message: '配送方式不能为空' })
  deliveryType!: 'pickup' | 'delivery';

  @IsOptional()
  @IsString()
  couponId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf(o => o.deliveryType === 'delivery')
  @IsNotEmpty({ message: '配送订单必须提供地址' })
  address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  usePoints?: number;
} 