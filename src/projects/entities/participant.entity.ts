import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
