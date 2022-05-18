import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN), // Token will expire in 1 hour
        issuer: process.env.HOST,
      },
    }),
  ],
  exports: [JwtModule],
})
export class CustomJwtModule {}
