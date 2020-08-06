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
  async findById(@Param() idParams: IdParams): Promise<ParentDto> {
    const { id } = idParams;
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
    @Param() idParams: IdParams,
    @Body() createParentDto: SaveParentDto,
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureParentExistence(id);
    return this.parentRepository.update({ ...createParentDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
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
