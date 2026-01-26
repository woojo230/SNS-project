import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostsImagesService } from './image/images.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([PostsModel, UsersModel, ImageModel]),
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthService, UsersService, PostsImagesService],
})
export class PostsModule {}
