import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  groupIds: string[];

  @OneToMany(
    type => Group,
    group => group.lecturer,
  )
  groups: Group[];
}
