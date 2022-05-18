import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from '../auth/jwt.module';
import { EncryptService } from '../_common/utils/encrypt/encrypt.service';
import { UserProfile } from './DTO/user.profile';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepo } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CustomJwtModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepo, UserProfile, EncryptService],
  exports: [UserRepo],
})
export class UserModule {}
