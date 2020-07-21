import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../../infrastructure/profile.repository';
import { ProfileDto } from '../dtos/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: ProfileRepository) {}

  async findById(id: string): Promise<ProfileDto> {
    const profile = await this.userRepository.findById(id);
    if (!profile) return null;
    return ProfileMapper.fromProfileToDto(profile);
  }
}
