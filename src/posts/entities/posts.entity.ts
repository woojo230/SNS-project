import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel {
  @PrimaryGeneratedColumn() // 유일무이한 값
  id: number;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
