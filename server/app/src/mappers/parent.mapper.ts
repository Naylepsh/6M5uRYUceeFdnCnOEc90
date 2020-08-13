import { SaveParentDto } from '../dtos/parents/save-parent.dto';
import { Parent } from '../models/parent.model';
import { ParentDto } from '../dtos/parents/parent.dto';
import { Student } from '../models/student.model';
import { Repository, getConnection } from 'typeorm';

export class ParentMapper {
  private static parentRepository: Repository<Parent>;

  public static toPersistance(
    saveParentDto: SaveParentDto,
    children: Student[] = [],
  ): Parent {
    this.ensureRepoIsInitialized();

    const { firstName, lastName, phoneNumber, email } = saveParentDto;
    const obj = {
      firstName,
      lastName,
      phoneNumber,
      email,
      children,
    };

    return this.parentRepository.create(obj);
  }

  public static toDto(parent: Parent): ParentDto {
    const { id, firstName, lastName, phoneNumber, email, children } = parent;
    return { id, firstName, lastName, phoneNumber, email, children };
  }

  private static ensureRepoIsInitialized() {
    if (!this.parentRepository) {
      this.parentRepository = getConnection().getRepository(Parent);
    }
  }
}
