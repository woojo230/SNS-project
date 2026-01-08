import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      // database type
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [PostsModel],
      synchronize: true, // 배포시 false 로 설정
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
