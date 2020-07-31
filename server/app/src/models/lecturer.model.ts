import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Group } from './group.model';
import { Consultation } from './consultation.model';

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
  groups: Group[];

  @ManyToMany(type => Consultation)
  consultations: Consultation[];
}
