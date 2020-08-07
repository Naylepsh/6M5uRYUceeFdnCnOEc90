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

  @ManyToMany(
    () => Lecturer,
    lecturer => lecturer.consultations,
  )
  @JoinTable()
  lecturers: Lecturer[];

  @ManyToMany(
    () => Student,
    student => student.consultations,
  )
  @JoinTable()
  students: Student[];
}
