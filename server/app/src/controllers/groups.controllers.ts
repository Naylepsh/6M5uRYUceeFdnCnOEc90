import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
  Delete,
  Put,
} from '@nestjs/common';
import { GroupRepository } from '../repositories/group.repository';
import { GroupDto } from '../dtos/groups/group.dto';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';

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
  async findById(@Param('id') id: string): Promise<GroupDto> {
    ensureUuidIsValid(id);
    const group = await this.ensureGroupExistence(id);
    return group;
  }

  @Post(apiEndpoint)
  async create(@Body() createGroupDto: SaveGroupDto): Promise<GroupDto> {
    const group = await this.groupRepository.create(createGroupDto);
    return group;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param('id') id: string,
    @Body() createGroupDto: SaveGroupDto,
  ): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureGroupExistence(id);
    return this.groupRepository.update({ ...createGroupDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param('id') id: string): Promise<void> {
    ensureUuidIsValid(id);
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

function ensureUuidIsValid(id: string): string {
  if (!validateUuid(id)) {
    throw new BadRequestException();
  }
  return id;
}

function validateUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const match = id.match(uuidRegex);
  return !!match;
}
