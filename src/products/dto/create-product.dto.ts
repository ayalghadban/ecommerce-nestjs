import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'title can not be blank.' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'description is not empty.' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'price is not empty.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be number & max decimal is 2' },
  )
  @IsPositive({ message: 'price should be positive.' })
  price: number;

  @IsNotEmpty({ message: 'stock is not empty.' })
  @IsNumber({}, { message: 'stock should be number.' })
  @Min(0, { message: 'stock can not be negative.' })
  stock: number;

  @IsNotEmpty({ message: 'images should not empty.' })
  @IsArray({ message: 'images should be in array format.' })
  images: string[];

  @IsNotEmpty({ message: 'category should not be empty.' })
  @IsNumber({}, { message: 'category id should be a number' })
  categoryId: number;
}
