import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateDto } from './DTO/createUser.dto';
import ResponseUserDto from './DTO/responseUser.dto';
import { User } from './user.entity';
import { UserRepo } from './user.repository';
import { UserConnectDto } from './DTO/connectUser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { EncryptService } from '../_common/utils/encrypt/encrypt.service';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    private jwtService: JwtService,
    private encryptService: EncryptService,
    @InjectMapper() private mapper: Mapper,
  ) {}

  async createUser(userCreateDto: UserCreateDto): Promise<ResponseUserDto> {
    const { password } = userCreateDto;
    const newUser = userCreateDto as User;
    const hashedPassword = await this.encryptService.hash(password);

    newUser.password = hashedPassword;

    const user = await this.userRepo.upsert(newUser);
    return this.mapper.map(user, User, ResponseUserDto);
  }

  async signIn(
    userConnectDto: UserConnectDto,
  ): Promise<{ accessToken: string; user: ResponseUserDto }> {
    const { email, password } = userConnectDto;
    const user = await this.userRepo.findByEmail(email);
    const isPasswordValid = await this.encryptService.compareHash(
      password,
      user.password,
    );

    if (user && isPasswordValid) {
      const payload: JwtPayload = {
        id: user.id,
        name: user.name,
        email,
        role: user.role,
      };
      const accessToken: string = await this.jwtService.sign(payload);
      return {
        accessToken,
        user: this.mapper.map(user, User, ResponseUserDto),
      };
    } else {
      throw new UnauthorizedException('Please check you login credentials');
    }
  }

  async getUser(email: string): Promise<ResponseUserDto> {
    const user = await this.userRepo.findByEmail(email);

    return this.mapper.map(user, User, ResponseUserDto);
  }
}
