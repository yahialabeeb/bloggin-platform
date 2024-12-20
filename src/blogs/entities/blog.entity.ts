import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  brief: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.blogs, { cascade: true })
  @JoinColumn({ name: 'author' })
  author: User;

  @Column()
  status: string;

  @Column()
  thumbnail: string;
}
