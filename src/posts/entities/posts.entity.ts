import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  author: UsersModel;

  @Column()
  @IsString({
    message: 'title은 string 타입만 취급합니다',
  })
  title: string;

  @Column()
  @IsString({
    message: 'title은 string 타입만 취급합니다',
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
