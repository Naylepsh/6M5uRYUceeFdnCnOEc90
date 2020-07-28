import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
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
  hour: string;

  @Column()
  address: string;

  @Column()
  room: string;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @Column({ nullable: true })
  lecturerId: string;

  @ManyToOne(
    type => Lecturer,
    lecturer => lecturer.groups,
  )
  lecturer: Lecturer;

  @ManyToMany(type => Student)
  @JoinTable()
  students: Student[];
}
