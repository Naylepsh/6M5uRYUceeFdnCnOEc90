import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.model';
import { Parent } from './parent.model';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(type => Group)
  @JoinTable()
  groups: Group[];

  @ManyToMany(
    type => Parent,
    parent => parent.children,
  )
  @JoinTable()
  parents: Parent[];
}
