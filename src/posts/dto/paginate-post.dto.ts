import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginatePostDto {
  // 이전 마지막 데이터의 ID값
  // 이 프로퍼티에 입력된 ID보다 높은 ID 부터 값을 가져오기
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  @IsIn(['ASC'])
  @IsOptional()
  order__createdAt?: 'ASC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 20;
}
