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
import { ParentRepository } from '../repositories/parent.repository';
import { ParentDto } from '../dtos/parents/parent.dto';
import { SaveParentDto } from '../dtos/parents/save-parent.dto';

const apiEndpoint = '/parents';

@Controller()
export class ParentsController {
  parentRepository: ParentRepository;
  constructor() {
    this.parentRepository = new ParentRepository();
  }

  @Get(apiEndpoint)
  async findAll(): Promise<ParentDto[]> {
    const parents = await this.parentRepository.findAll();
    return parents;
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param('id') id: string): Promise<ParentDto> {
    ensureUuidIsValid(id);
    const parent = await this.ensureParentExistence(id);
    return parent;
  }

  @Post(apiEndpoint)
  async create(@Body() createParentDto: SaveParentDto): Promise<ParentDto> {
    const parent = await this.parentRepository.create(createParentDto);
    return parent;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param('id') id: string,
    @Body() createParentDto: SaveParentDto,
  ): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureParentExistence(id);
    return this.parentRepository.update({ ...createParentDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param('id') id: string): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureParentExistence(id);
    return this.parentRepository.delete(id);
  }

  private async ensureParentExistence(id: string): Promise<ParentDto> {
    const parent = await this.parentRepository.findById(id);
    if (!parent) {
      throw new NotFoundException();
    }
    return parent;
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
