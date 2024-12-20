import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
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

  @Column({ name: 'author' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.blogs, { cascade: true })
  @JoinColumn({ name: 'author' })
  author: User;

  @Column()
  status: string;

  @Column()
  thumbnail: string;

  @OneToMany(() => Comment, (comment) => comment.blog)
  @JoinColumn({ name: 'comments' })
  comments: Comment[];
}
