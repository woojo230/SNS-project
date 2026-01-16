import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const user = req.user;

  // UserDecorator는 무조건 AccessTokenGuard를 사용할 수 있다는 가정 하에 설계
  if (!user) {
    throw new InternalServerErrorException(
      'request에 user가 존재하지 않습니다',
    );
  }
  return user;
});
