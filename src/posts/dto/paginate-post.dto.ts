import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // 이전 마지막 데이터의 ID값
  // 이 프로퍼티에 입력된 ID보다 높은 ID 부터 값을 가져오기
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt?: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 20;
}
