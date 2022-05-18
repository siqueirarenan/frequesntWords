import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { RoleGuard } from '../auth/role.guard';
import { ErrorDto } from '../_common/filters/DTO/errorList.dto';
import { HttpExceptionFilter } from '../_common/filters/http-exception.filter';
import { UserConnectDto } from './DTO/connectUser.dto';
import { UserCreateDto } from './DTO/createUser.dto';
import ResponseUserDto from './DTO/responseUser.dto';
import { UserService } from './user.service';
import { JwtDecorator } from '../_common/decorators/jwt.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@ApiTags('Users')
@Controller('users')
@ApiNotFoundResponse({ type: ErrorDto })
@ApiBadRequestResponse({ type: ErrorDto })
@ApiConflictResponse({ type: ErrorDto })
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signUp(@Body() userCreateDto: UserCreateDto): Promise<ResponseUserDto> {
    return this.userService.createUser(userCreateDto);
  }

  @Post('/signin')
  @UseFilters(HttpExceptionFilter)
  @HttpCode(200)
  @ApiOkResponse({ type: ResponseUserDto })
  async signIn(
    @Body() userConnectDto: UserConnectDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { accessToken, user } = await this.userService.signIn(userConnectDto);
    response.cookie('jwt', accessToken, { httpOnly: true });
    return { ...user, accessToken };
  }

  @Get('authcheck')
  @UseGuards(RoleGuard)
  @ApiOkResponse({ type: ResponseUserDto })
  async authcheck(@JwtDecorator() user: JwtPayload) {
    return await this.userService.getUser(user.email);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Now disconnected',
    };
  }
}
