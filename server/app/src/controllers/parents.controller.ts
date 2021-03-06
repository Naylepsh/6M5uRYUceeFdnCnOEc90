import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Delete,
  Put,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { ParentRepository } from '../repositories/parent.repository';
import { IRepository } from '../repositories/repository.interface';
import { ParentDto } from '../dtos/parents/parent.dto';
import { SaveParentDto } from '../dtos/parents/save-parent.dto';
import { IdDto } from '../dtos/id/id.dto';
import { ParentMapper } from '../mappers/parent.mapper';
import { Parent } from '../models/parent.model';
import { Student } from '../models/student.model';
import { StudentsByIdsPipe } from '../pipes/students-by-ids.pipe';

const apiEndpoint = '/parents';

@Controller()
export class ParentsController {
  parentRepository: IRepository<Parent>;

  constructor(private readonly connection: Connection) {
    this.parentRepository = new ParentRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<ParentDto[]> {
    const parents = await this.parentRepository.findAll();
    return parents.map(ParentMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idDto: IdDto): Promise<ParentDto> {
    const { id } = idDto;
    const parent = await this.ensureParentExistence(id);
    return ParentMapper.toDto(parent);
  }

  @Post(apiEndpoint)
  async create(
    @Body() saveParentDto: SaveParentDto,
    @Body('children', StudentsByIdsPipe) children: Student[],
  ): Promise<ParentDto> {
    const parent = ParentMapper.toPersistance(saveParentDto, children);
    const res = await this.parentRepository.create(parent);
    return res;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idDto: IdDto,
    @Body() saveParentDto: SaveParentDto,
    @Body('children', StudentsByIdsPipe) children: Student[],
  ): Promise<void> {
    const { id } = idDto;
    await this.ensureParentExistence(id);
    const parent = ParentMapper.toPersistance(saveParentDto, children);
    return this.parentRepository.update({ ...parent, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idDto: IdDto): Promise<void> {
    const { id } = idDto;
    await this.ensureParentExistence(id);
    return this.parentRepository.delete(id);
  }

  private async ensureParentExistence(id: string): Promise<Parent> {
    const parent = await this.parentRepository.findById(id);
    if (!parent) {
      throw new NotFoundException();
    }
    return parent;
  }
}
