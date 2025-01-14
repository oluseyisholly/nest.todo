import { DeleteResult, ILike, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  PageInfo,
  PaginatedRecordsDto,
  PaginationDto,
} from 'src/dtos/pagination.dto';
import { UserFilterDto } from 'src/dtos/user.dto';

@Injectable() // Note: `EntityRepository` is deprecated, consider using DI with `@InjectRepository`.
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: User): Promise<User> {
    console.log(data);
    return await this.userRepository.save(data);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { emailAddress: email } });
  }

  

  async findAll(
    paginationDto: PaginationDto,
    userFilterDto: UserFilterDto,
  ): Promise<PaginatedRecordsDto<User>> {
    const { page, per_page, sortOrder } = paginationDto;

    const where = this.buildQuery(userFilterDto);

    const [data, total] = await Promise.all([
      this.userRepository.find({
        select : [
          'id',
          'firstName',
          'lastName',
          'createdAt',
          'updatedAt',
          'createdBy',
          'updatedBy',
          'emailAddress'
        ],
        where,
        order: {
          ['createdAt']: sortOrder,
        },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      this.userRepository.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / per_page);
    const pageInfo: PageInfo = {
      total,
      currentPage: page,
      perPage: per_page,
      totalPages,
    };

    return {
      data,
      pageInfo,
    };
  }

  async updateById(data: User): Promise<User> {
    return await this.userRepository.save(data);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }

  private buildQuery = (callHomeFilterDto: UserFilterDto): Partial<User[]> => {
    const { searchQuery } = callHomeFilterDto;

    let where = [];

    if (searchQuery) {
      where = [
        {
          firstName: ILike(`%${searchQuery}%`),
        },
        // {
        //   ifavailable: ILike(`%${searchQuery}%`),
        // },
      ];
    }

    return where;
  };

  // Add other custom methods as needed
}
