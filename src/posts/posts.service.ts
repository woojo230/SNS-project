import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'Tyron Woo',
    title: 'coco',
    content: 'i got the coco',
    likeCount: 20,
    commentCount: 10,
  },
  {
    id: 2,
    author: 'Tyron Kim',
    title: 'popo',
    content: 'i got the popo',
    likeCount: 20,
    commentCount: 10,
  },
  {
    id: 3,
    author: 'Tyron Yang',
    title: 'popo',
    content: 'i got the',
    likeCount: 20,
    commentCount: 10,
  },
];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    // repository 사용하는 모든 함수들은 비동기로 작동
    const post = await this.postsRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(author: string, title: string, content: string) {
    // 1) create -> 저장할 객체를 생성.(DB에 저장하는 것이 아닌, 객체만 생성하기 때문에 동기적으로 실행됨)
    // 2) save -> 객체를 저장. (create 매서드에서 생성한 객체로) (실제 DB에 저장하기 때문에 비동기적으로 실행)

    const post = this.postsRepository.create({
      // id는 db에서 자체적으로 생성해줌
      author: author,
      title: title,
      content: content,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return post;
  }

  async updatePost(
    postId: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
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
