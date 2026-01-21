import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ConfigService } from '@nestjs/config';
import {
  ENV_HOST_KEY,
  ENV_PROTOCOL_KEY,
} from 'src/common/const/env-keys.const';
import {
  POST_IMAGE_PATH,
  PUBLIC_FOLDER_PATH,
  TEMP_FOLDER_NAME,
  TEMP_FOLDER_PATH,
} from 'src/common/const/path.const';
import { basename, join } from 'path';
import { promises } from 'fs';

// export interface PostModel {
//   id: number;
//   author: string;
//   title: string;
//   content: string;
//   likeCount: number;
//   commentCount: number;
// }

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly configService: ConfigService,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  // async paginatePosts(dto: PaginatePostDto) {
  //   if (dto.page) {
  //     this.pagePaginatePosts(dto);
  //   } else {
  //     return this.cursorpaginatePosts(dto);
  //   }
  // }

  // async pagePaginatePosts(dto: PaginatePostDto) {
  //   const [posts, count] = await this.postsRepository.findAndCount({
  //     skip: dto.take * (dto.page - 1),
  //     take: dto.take,
  //     order: {
  //       createdAt: dto.order__createdAt,
  //     }
  //   });

  //   return {
  //     data: posts,
  //     total: count,
  //   }
  // }

  async cursorpaginatePosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostsModel> = {};

    if (dto.where__id__less_than) {
      where.id = LessThan(dto.where__id__less_than);
    } else if (dto.where__id__more_than) {
      where.id = MoreThan(dto.where__id__more_than);
    }

    const posts = await this.postsRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;

    const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
    const host = this.configService.get<string>(ENV_HOST_KEY);

    const nextUrl = lastItem && new URL(`${protocol}://${host}/posts`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      const key =
        dto.order__createdAt === 'ASC'
          ? 'where__id__more_than'
          : 'where__id__less_than';

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: posts,
      cursur: { after: lastItem?.id ?? null },
      count: posts.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
        // images: [],
      });
    }
  }

  async getPostById(id: number) {
    // repository 사용하는 모든 함수들은 비동기로 작동
    const post = await this.postsRepository.findOne({
      where: {
        id: id,
      },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPostImage(dto: CreatePostDto) {
    // dto 이미지 이름 기반으로 파일의 경로를 생성
    const tempFilePath = join(
      TEMP_FOLDER_PATH,
      dto.image ?? 'default-image.png',
    );

    try {
      // 파일이 존재하는지 확인
      // 만약에 존재하지 않으면 에러 던짐
      await promises.access(tempFilePath);
    } catch (error) {
      throw new BadRequestException('존재하지 않는 파일');
    }

    const fileName = basename(tempFilePath);

    // 새로 이동할 post 폴더의 경로+이미지 이름
    // {프로젝트 경로}/public/posts/adsfa.jpg
    const newPath = join(POST_IMAGE_PATH, fileName);

    await promises.rename(tempFilePath, newPath);

    return true;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    // 1) create -> 저장할 객체를 생성.(DB에 저장하는 것이 아닌, 객체만 생성하기 때문에 동기적으로 실행됨)
    // 2) save -> 객체를 저장. (create 매서드에서 생성한 객체로) (실제 DB에 저장하기 때문에 비동기적으로 실행)

    const post = this.postsRepository.create({
      // id는 db에서 자체적으로 생성해줌
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return post;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }
}
