import { Blog } from 'src/blogs/entities/blog.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Blog, (blog) => blog.author)
  @JoinColumn({ name: 'blog' })
  blogs: Blog[];

  @OneToMany(() => Comment, (comment) => comment.author)
  @JoinColumn({ name: 'blog' })
  comments: Comment[];
}
