import { HttpStatus, HttpException } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor() {
    super('Not Found', HttpStatus.NOT_FOUND);
  }
}
