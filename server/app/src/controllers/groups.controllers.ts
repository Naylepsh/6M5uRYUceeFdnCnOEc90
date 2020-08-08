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
import { GroupRepository } from '../repositories/group.repository';
import { GroupDto } from '../dtos/groups/group.dto';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';
import { IdParams } from './id.params';
import { Connection } from 'typeorm';
import { GroupMapper } from '../mappers/group.mapper';
import { Group } from '../models/group.model';
import { LecturerRepository } from '../repositories/lecturer.repository';
import { StudentRepository } from '../repositories/student.repository';

const apiEndpoint = '/groups';

@Controller()
export class GroupsController {
  groupRepository: GroupRepository;
  lecturerRepository: LecturerRepository;
  studentRepository: StudentRepository;

  constructor(private readonly connection: Connection) {
    this.groupRepository = new GroupRepository(connection);
    this.lecturerRepository = new LecturerRepository(connection);
    this.studentRepository = new StudentRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<GroupDto[]> {
    const groups = await this.groupRepository.findAll();
    return groups.map(GroupMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idParams: IdParams): Promise<GroupDto> {
    const { id } = idParams;
    const group = await this.ensureGroupExistence(id);
    return GroupMapper.toDto(group);
  }

  @Post(apiEndpoint)
  async create(@Body() saveGroupDto: SaveGroupDto): Promise<GroupDto> {
    const lecturers = await this.lecturerRepository.findByIds(
      saveGroupDto.lecturers,
    );
    const students = await this.studentRepository.findByIds(
      saveGroupDto.students,
    );
    const group = GroupMapper.toPersistance(saveGroupDto, lecturers, students);
    const res = await this.groupRepository.create(group);
    return res;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() saveGroupDto: SaveGroupDto,
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureGroupExistence(id);
    const lecturers = await this.lecturerRepository.findByIds(
      saveGroupDto.lecturers,
    );
    const students = await this.studentRepository.findByIds(
      saveGroupDto.students,
    );
    const group = GroupMapper.toPersistance(saveGroupDto, lecturers, students);
    return this.groupRepository.update({ ...group, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
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
