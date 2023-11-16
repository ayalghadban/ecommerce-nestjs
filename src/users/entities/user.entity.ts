import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp, UpdateDateColumn, OneToMany} from 'typeorm'
@Entity('users')
export class UserEntity
{
    @PrimaryGeneratedColumn({primaryKeyConstraintName:'pk_user_id'})
    id:number;

    @Column()
    name:string;

    @Column({unique: true})
    email:string;

    @Column({select: false})
    password:string;

    @Column({type:'enum',enum: Roles, array:true,default:[Roles.USER]})
    role:Roles[];

    @CreateDateColumn()
    createdAt:Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(() => CategoryEntity, (cat) => cat.addedBy)
    categories: CategoryEntity[]
    
    @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
    products: ProductEntity[];

    @OneToMany(() => ReviewEntity, (rev) => rev.user)
    reviews: ReviewEntity[];

    @OneToMany(() => OrderEntity, (order) => order.updatedBy)
    orderUpdatedBy: OrderEntity[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[];
    
}
