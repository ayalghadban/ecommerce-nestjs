import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-role.decorator';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
//import { Query } from 'typeorm/driver/Query';
import { SerializeIncludes, SerializeInterceptor } from 'src/utility/interceptors/serialize.interceptor';
import { ProductsDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() currentUser:UserEntity) 
  :Promise<ProductEntity>{
    return await this.productsService.create(createProductDto, currentUser);
  }

  @SerializeIncludes(ProductsDto)
  @Get()
  async findAll(@Req() request:any) : Promise<ProductsDto>{
    const queryParam = request.query;
    return await this.productsService.findAll(queryParam);
  }

  @Get(':id')
  async findOne(@Param('id') id: string){
    return await this.productsService.findOne(+id);
  }

  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() currentUser:UserEntity) 
  :Promise<ProductEntity>
  {
    return await this.productsService.update(+id, updateProductDto, currentUser);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}
