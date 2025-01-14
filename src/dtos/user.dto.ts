import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { BaseFilterDto } from './baseFilter.dto';
import { Match } from 'src/decorators/match.decorator';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  emailAddress: string;

  @MinLength(7)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CreateUser extends LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @MinLength(7)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}

export class UpdateUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class TokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  emailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token?: string;
}

export class UserFilterDto extends BaseFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchQuery?: string;
}
