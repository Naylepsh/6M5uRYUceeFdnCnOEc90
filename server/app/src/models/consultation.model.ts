import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lecturer } from './lecturer.model';
import { Student } from './student.model';

@Entity()
export class Consultation {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  datetime: Date;

  @Column()
  address: string;

  @Column()
  room: string;

  @ManyToMany(type => Lecturer)
  @JoinTable()
  lecturers: Lecturer[];

  @ManyToMany(type => Student)
  @JoinTable()
  students: Student[];
}
