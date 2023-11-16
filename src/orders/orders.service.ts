import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrederStatusDto } from './dto/update-order-status.dto';
import { OrderEnum } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,
    @Inject(forwardRef(()=>ProductsService)) private readonly productService: ProductsService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);
    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    const orderTbl = await this.orderRepository.save(orderEntity);

    let opEntity: {
      order: OrderEntity;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }[];
    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
      opEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price,
      });
    }
    const op = await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();
    return await this.findOne(orderTbl.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true,
        },
      },
    });
  }

  async findeOneByProductId(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true,
        },
      },
    });
  }
  async update(
    id: number,
    updateOrderStatusDto: UpdateOrederStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('order not found');
    if (
      order.status === OrderEnum.DELIVERED ||
      order.status === OrderEnum.CANCELLED
    ) {
      throw new BadRequestException(`order already ${order.status}`);
    }
    if (
      order.status === OrderEnum.PROCESSING &&
      updateOrderStatusDto.status != OrderEnum.SHIPPED
    ) {
      throw new BadRequestException(`Delivary before shipped`);
    }
    if (
      updateOrderStatusDto.status === OrderEnum.SHIPPED &&
      order.status === OrderEnum.SHIPPED
    ) {
      return order;
    }
    if (updateOrderStatusDto.status === OrderEnum.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderEnum.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    if (updateOrderStatusDto.status === OrderEnum.DELIVERED) {
      await this.stockUpdate(order, OrderEnum.DELIVERED);
    }
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('order npt found');
    if (order.status === OrderEnum.CANCELLED) return order;
    order.status = OrderEnum.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderEnum.CANCELLED);
    return order;
  }
}
