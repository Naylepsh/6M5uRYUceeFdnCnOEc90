import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Student } from './student.model';

@Entity()
export class Parent {
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
    type => Student,
    student => student.parents,
  )
  children: Student[];
}
