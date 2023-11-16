import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone can not be empty' })
  @IsString({ message: 'phone format should be string' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'name should be string' })
  name: string;

  @IsNotEmpty({ message: 'address can not be empty' })
  @IsString({ message: 'address should be string' })
  address: string;

  @IsNotEmpty({ message: 'city can not be empty' })
  @IsString({ message: 'city should be string' })
  city: string;

  @IsNotEmpty({ message: 'postCode can not be empty' })
  @IsString({ message: 'postCode should be string' })
  postCode: string;

  @IsNotEmpty({ message: 'state can not be empty' })
  @IsString({ message: 'state should be string' })
  state: string;

  @IsNotEmpty({ message: 'country can not be empty' })
  @IsString({ message: 'country should be string' })
  country: string;
}
