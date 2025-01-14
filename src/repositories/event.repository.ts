import { DeleteResult, ILike, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Event } from 'src/entities/event.entity';
import {
  PageInfo,
  PaginatedRecordsDto,
  PaginationDto,
} from 'src/dtos/pagination.dto';
import { EventFilterDto } from 'src/dtos/event.dto';

@Injectable() // Note: `EntityRepository` is deprecated, consider using DI with `@InjectRepository`.
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findById(id: number): Promise<Event> {
    return this.eventRepository.findOne({ where: { id } });
  }

  async updateById(data: Event): Promise<Event> {
    return await this.eventRepository.save(data);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.eventRepository.delete({ id });
  }

  async findAll(
    paginationDto: PaginationDto,
    userFilterDto: EventFilterDto,
  ): Promise<PaginatedRecordsDto<Event>> {
    const { page, per_page, sortOrder } = paginationDto;

    const where = this.buildQuery(userFilterDto);

    const [data, total] = await Promise.all([
      this.eventRepository.find({
        where,
        order: {
          ['createdAt']: sortOrder,
        },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      this.eventRepository.count({
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

  // Add other custom methods as needed

  private buildQuery = (eventFilterDto: EventFilterDto): Partial<Event[]> => {
    const { searchQuery } = eventFilterDto;

    let where = [];

    if (searchQuery) {
      where = [
        {
          name: ILike(`%${searchQuery}%`),
        },
        // {
        //   ifavailable: ILike(`%${searchQuery}%`),
        // },
      ];
    }

    return where;
  };
}
