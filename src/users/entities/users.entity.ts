import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import {
  IsEmail,
  IsString,
  Length,
  ValidationArguments,
} from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';
import { CommentsModel } from 'src/posts/comments/entity/comments.entity';

@Entity()
export class UsersModel extends BaseModel {
  @IsString({ message: stringValidationMessage })
  @Column()
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @IsString({ message: stringValidationMessage })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  @Column({
    length: 20,
    unique: true,
  })
  email: string;

  @IsString({ message: stringValidationMessage })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  @Exclude({
    toPlainOnly: true,
  })
  @Column({
    unique: true,
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @OneToMany(() => CommentsModel, (commets) => commets.author)
  postComments: CommentsModel[];
}
