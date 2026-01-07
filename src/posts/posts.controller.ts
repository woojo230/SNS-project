import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel {
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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPost() {
    return posts;
  }
}
