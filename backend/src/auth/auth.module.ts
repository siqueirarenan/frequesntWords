import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule, UserModule],
  providers: [JwtStrategy],
  exports: [JwtStrategy], // Will allow to use the JWT stuff in every modules
})
export class AuthModule {}
