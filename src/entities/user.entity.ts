import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from './base';
import { Event } from './event.entity';

@Entity({ name: 'user' })
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;
  

  @Column()
  password: string;

  @Column({ unique: true })
  emailAddress: string;

  @OneToMany(() => Event, (_event) => _event.id)
  events: Event[];
}
