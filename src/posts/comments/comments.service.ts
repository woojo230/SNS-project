import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from '../entities/posts.entity';
import { Repository } from 'typeorm';
import { CommentsModel } from './entity/comments.entity';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    private readonly commonService: CommentsService,
  ) {}

  async getAllComments() {
    return this.commentsRepository.find({
      relations: {
        post: true,
      },
    });
  }

  async createComments() {
    const comments = this.commentsRepository.create({});
  }

  //   paginateComments(dto: PaginateCommentsDto, postId: number) {
  //     return this.commonService.paginate(
  //       dto,
  //       this.commentsRepository,
  //       {},
  //       `posts/${postId}/comments`,
  //     );
  //   }
}
