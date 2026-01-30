import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
}
