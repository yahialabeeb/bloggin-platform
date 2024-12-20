import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ name: 'author' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.comments, { cascade: true })
  @JoinColumn({ name: 'author' })
  author: User;

  @Column({ name: 'blog' })
  blogId: string;

  @ManyToOne(() => Blog, (blog) => blog.comments, { cascade: true })
  @JoinColumn({ name: 'blog' })
  blog: Blog;
}
