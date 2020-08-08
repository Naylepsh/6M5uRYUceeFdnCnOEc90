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
import { ParentRepository } from '../repositories/parent.repository';
import { ParentDto } from '../dtos/parents/parent.dto';
import { SaveParentDto } from '../dtos/parents/save-parent.dto';
import { IdParams } from './id.params';
import { Connection } from 'typeorm';
import { StudentRepository } from '../repositories/student.repository';
import { ParentMapper } from '../mappers/parent.mapper';
import { Parent } from '../models/parent.model';

const apiEndpoint = '/parents';

@Controller()
export class ParentsController {
  parentRepository: ParentRepository;
  studentRepository: StudentRepository;

  constructor(private readonly connection: Connection) {
    this.parentRepository = new ParentRepository(connection);
    this.studentRepository = new StudentRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<ParentDto[]> {
    const parents = await this.parentRepository.findAll();
    return parents.map(ParentMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idParams: IdParams): Promise<ParentDto> {
    const { id } = idParams;
    const parent = await this.ensureParentExistence(id);
    return ParentMapper.toDto(parent);
  }

  @Post(apiEndpoint)
  async create(@Body() saveParentDto: SaveParentDto): Promise<ParentDto> {
    const students = await this.studentRepository.findByIds(
      saveParentDto.children,
    );
    const parent = ParentMapper.toPersistance(saveParentDto, students);
    const res = await this.parentRepository.create(parent);
    return res;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() saveParentDto: SaveParentDto,
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureParentExistence(id);
    const students = await this.studentRepository.findByIds(
      saveParentDto.children,
    );
    const parent = ParentMapper.toPersistance(saveParentDto, students);
    return this.parentRepository.update({ ...parent, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
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
