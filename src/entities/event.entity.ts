import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Base } from './base';
import { User } from './user.entity';

@Entity({ name: 'event' })
export class Event extends Base {
  @Column()
  name: string;

  @Column({ nullable: true })
  time: Date;

  @Column({ nullable: true })
  duration: number;

  @ManyToOne(() => User, (user) => user.events)
  user: User;
}
