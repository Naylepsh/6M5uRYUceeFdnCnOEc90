import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Group } from './group.model';

@Entity()
export class Lecturer {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @ManyToMany(
    type => Group,
    group => group.lecturers,
  )
  @JoinTable()
  groups: Group[];
}
