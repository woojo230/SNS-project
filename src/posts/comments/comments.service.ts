import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from '../entities/posts.entity';
import { Repository } from 'typeorm';
import { CommentsModel } from './entity/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
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
}
