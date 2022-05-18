import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserKnowlegeService } from './userKnowlege.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from '../_common/filters/DTO/errorList.dto';
import { UserKnowlegeResponseDto } from './DTO/userKnowlegeResponse.dto';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../users/enum/role.enum';
import { Roles } from '../_common/decorators/roles.decorator';
import { JwtDecorator } from '../_common/decorators/jwt.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@ApiTags('UserKnowleges')
@Controller('userKnowleges')
@ApiNotFoundResponse({ type: ErrorDto })
@ApiBadRequestResponse({ type: ErrorDto })
export class UserKnowlegeController {
  constructor(private userKnowlegeService: UserKnowlegeService) {}

  @Get()
  @Roles(Role.simple)
  @UseGuards(RoleGuard)
  @HttpCode(200)
  @ApiOkResponse({ type: UserKnowlegeResponseDto, isArray: true })
  getUserKnowleges(
    @JwtDecorator() userData: JwtPayload,
  ): Promise<UserKnowlegeResponseDto[]> {
    return this.userKnowlegeService.findAll(userData.id);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: UserKnowlegeResponseDto })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserKnowlegeResponseDto> {
    return this.userKnowlegeService.findById(id);
  }
}
