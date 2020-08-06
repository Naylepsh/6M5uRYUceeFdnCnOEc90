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

const apiEndpoint = '/groups';

@Controller()
export class GroupsController {
  groupRepository: GroupRepository;
  constructor() {
    this.groupRepository = new GroupRepository();
  }

  @Get(apiEndpoint)
  async findAll(): Promise<GroupDto[]> {
    const groups = await this.groupRepository.findAll();
    return groups;
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idParams: IdParams): Promise<GroupDto> {
    const { id } = idParams;
    const group = await this.ensureGroupExistence(id);
    return group;
  }

  @Post(apiEndpoint)
  async create(@Body() saveGroupDto: SaveGroupDto): Promise<GroupDto> {
    const group = await this.groupRepository.create(saveGroupDto);
    return group;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() createGroupDto: SaveGroupDto,
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureGroupExistence(id);
    return this.groupRepository.update({ ...createGroupDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
    await this.ensureGroupExistence(id);
    return this.groupRepository.delete(id);
  }

  private async ensureGroupExistence(id: string): Promise<GroupDto> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException();
    }
    return group;
  }
}
