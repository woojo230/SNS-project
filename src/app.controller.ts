import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPost(): Post {
    return {
      author: 'Tyron Woo',
      title: 'COCO',
      content: 'I got the coco',
      likeCount: 38,
      commentCount: 40,
    };
  }
}
