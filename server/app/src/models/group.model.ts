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
export class Group {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  day: string;

  @Column()
  time: string;

  @Column()
  address: string;

  @Column()
  room: string;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @ManyToMany(
    () => Lecturer,
    lecturer => lecturer.groups,
  )
  @JoinTable()
  lecturers: Lecturer[];

  @ManyToMany(() => Student)
  @JoinTable()
  students: Student[];
}
