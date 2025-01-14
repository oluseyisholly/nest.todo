import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerApiEnumTags } from '../common/index.enum';
import {
  CreateUser,
  LoginUserDto,
  TokenDto,
  UpdateUser,
  UserFilterDto,
} from 'src/dtos/user.dto';
import { HttpExceptionFilter } from 'src/middleware/exception.filter';
import { UserService } from 'src/services/user.services';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { User } from 'src/entities/user.entity';
import { StandardResopnse } from 'src/common';
import { Public } from 'src/decorators/skipAuth.decorator';
import { DeleteResult } from 'typeorm';

@Controller('User')
@ApiTags(SwaggerApiEnumTags.USER)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  createUser(@Body() creatUser: CreateUser): Promise<StandardResopnse<User>> {
    return this.userService.createUser(creatUser);
  }

  @Post('login')
  @Public()
  loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<StandardResopnse<TokenDto>> {
    return this.userService.LoginUser(loginUserDto);
  }

  @Patch(':id')
  updateUser(
    @Body() updateUser: UpdateUser,
    @Param('id') id: number,
  ): Promise<StandardResopnse<TokenDto>> {
    return this.userService.updateUser(id, updateUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<StandardResopnse<DeleteResult>> {
    return this.userService.deleteUser(id);
  }

  @Get()
  async findUsers(
    @Query() paginationDto: PaginationDto,
    @Query() userFilterDto: UserFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<User>>> {
    return this.userService.findUsers(paginationDto, userFilterDto);
  }
}
