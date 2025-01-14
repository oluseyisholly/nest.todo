import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import {
  CreateUser,
  LoginUserDto,
  TokenDto,
  UpdateUser,
  UserFilterDto,
} from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repositoty';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async createUser(createUser: CreateUser): Promise<StandardResopnse<User>> {
    const saltOrRounds = 10;
    const _password = await bcrypt.hash(createUser.password, saltOrRounds);

    const existingUser = await this.userRepository.findUserByEmail(
      createUser.emailAddress,
    );

    if (existingUser) {
      throw new NotFoundException('Email Address Already Exists');
    }

    const user = plainToInstance(User, { ...createUser, password: _password });
    await this.userRepository.createUser(user);
    return {
      data: user,
      code: 200,
      message: 'Success',
    };
  }

  async updateUser(id: number, updateUser: UpdateUser) {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User Not found');
    }

    Object.assign(existingUser, updateUser);

    await this.userRepository.createUser({
      ...existingUser,
      updatedAt: new Date().toISOString(),
    });

    return {
      data: plainToInstance(User, updateUser),
      code: 200,
      message: 'Success',
    };
  }

  async deleteUser(id: number) {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User Not found');
    }

    const result = await this.userRepository.deleteById(id);

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }

  async findUsers(
    paginationDto: PaginationDto,
    userFilterDto: UserFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<User>>> {
    return {
      data: await this.userRepository.findAll(paginationDto, userFilterDto),
      code: 200,
      message: 'Success',
    };
  }

  async LoginUser(
    loginUser: LoginUserDto,
  ): Promise<StandardResopnse<TokenDto>> {
    //find user
    const user = await this.userRepository.findUserByEmail(
      loginUser.emailAddress,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(loginUser.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const _user: TokenDto = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    };
    return {
      code: 200,
      message: 'success',
      data: {
        ..._user,
        token: await this.jwtService.signAsync({ ...user }),
      },
    };
  }
}
