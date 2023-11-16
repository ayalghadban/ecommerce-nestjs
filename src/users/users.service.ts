import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,){}

  async signup(UserSignUpDto:UserSignUpDto):Promise<UserEntity>
  {
    const UserExists = await this.findUserByEmail(UserSignUpDto.email);
    if(UserExists) throw new BadRequestException('Email is not available');
    UserSignUpDto.password =await hash(UserSignUpDto.password,10);
    let user = this.userRepository.create(UserSignUpDto);
    user =  await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto)
  {
    const UserExists = await this.userRepository.createQueryBuilder('users').addSelect('users.password')
    .where('users.email=:email',{email:userSignInDto.email}).getOne();
    if(!UserExists) throw new BadRequestException('Bad creadentials');
    const matchPassword = await compare(userSignInDto.password, UserExists.password);
    if(!matchPassword) throw new BadRequestException('wrong password');
    delete UserExists.password;
    return UserExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number) :Promise<UserEntity>
  {
    const user =  await this.userRepository.findOneBy({id});
    if(!user) throw new NotFoundException('user not found.');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email:string)
  {
    return await this.userRepository.findOneBy({email});
  }

  async accessToken(user: UserEntity)
  {
    return sign
    (
      {
        id:+user.id,
        email: user.email
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: 
          process.env.ACCESS_TOKE_EXPIRE_TIME
      }
    )
  }
}
