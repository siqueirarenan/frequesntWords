import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepo } from '../users/user.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepo: UserRepo) {
    super({
      secretOrKey: process.env.SECRET_JWT,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // how to extract the token
    });
  }
  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
