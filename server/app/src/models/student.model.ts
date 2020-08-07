import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.model';
import { Parent } from './parent.model';
import { Consultation } from './consultation.model';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(
    () => Group,
    group => group.students,
  )
  groups: Group[];

  @ManyToMany(
    () => Parent,
    parent => parent.children,
  )
  @JoinTable()
  parents: Parent[];

  @ManyToMany(
    () => Consultation,
    consultation => consultation.students,
  )
  consultations: Consultation[];
}
