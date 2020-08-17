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
import { GroupRepository } from '../repositories/group.repository';
import { IRepository } from '../repositories/repository.interface';
import { GroupDto } from '../dtos/groups/group.dto';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';
import { IdDto } from '../dtos/id/id.dto';
import { GroupMapper } from '../mappers/group.mapper';
import { Group } from '../models/group.model';
import { Lecturer } from '../models/lecturer.model';
import { Student } from '../models/student.model';
import { StudentsByIdsPipe } from '../pipes/students-by-ids.pipe';
import { LecturersByIdsPipe } from '../pipes/lecturers-by-ids.pipe';

const apiEndpoint = '/groups';

@Controller()
export class GroupsController {
  groupRepository: IRepository<Group>;

  constructor(private readonly connection: Connection) {
    this.groupRepository = new GroupRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<GroupDto[]> {
    const groups = await this.groupRepository.findAll();
    return groups.map(GroupMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idDto: IdDto): Promise<GroupDto> {
    const { id } = idDto;
    const group = await this.ensureGroupExistence(id);
    return GroupMapper.toDto(group);
  }

  @Post(apiEndpoint)
  async create(
    @Body() saveGroupDto: SaveGroupDto,
    @Body('lecturers', LecturersByIdsPipe) lecturers: Lecturer[],
    @Body('students', StudentsByIdsPipe) students: Student[],
  ): Promise<GroupDto> {
    const group = GroupMapper.toPersistance(saveGroupDto, lecturers, students);
    const res = await this.groupRepository.create(group);
    return res;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idDto: IdDto,
    @Body() saveGroupDto: SaveGroupDto,
    @Body('lecturers', LecturersByIdsPipe) lecturers: Lecturer[],
    @Body('students', StudentsByIdsPipe) students: Student[],
  ): Promise<void> {
    const { id } = idDto;
    await this.ensureGroupExistence(id);
    const group = GroupMapper.toPersistance(saveGroupDto, lecturers, students);
    return this.groupRepository.update({ ...group, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idDto: IdDto): Promise<void> {
    const { id } = idDto;
    await this.ensureGroupExistence(id);
    return this.groupRepository.delete(id);
  }

  private async ensureGroupExistence(id: string): Promise<Group> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException();
    }
    return group;
  }
}
