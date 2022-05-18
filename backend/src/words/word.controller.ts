import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../users/enum/role.enum';
import { JwtDecorator } from '../_common/decorators/jwt.decorator';
import { Roles } from '../_common/decorators/roles.decorator';
import { ErrorDto } from '../_common/filters/DTO/errorList.dto';
import { WordResponseDto } from './DTO/wordResponse.dto';
import { WordService } from './Word.service';

@ApiTags('Words')
@Controller('words')
@ApiNotFoundResponse({ type: ErrorDto })
@ApiBadRequestResponse({ type: ErrorDto })
export class WordController {
  constructor(private wordService: WordService) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: WordResponseDto, isArray: true })
  getWords(
    @Query('languageId', new ParseIntPipe()) languageId: number,
  ): Promise<WordResponseDto[]> {
    return this.wordService.findAll(languageId);
  }

  @Get('next')
  @Roles(Role.simple)
  @UseGuards(RoleGuard)
  @HttpCode(200)
  @ApiOkResponse({ type: WordResponseDto, isArray: true })
  getNextWord(
    @Query('languageId', new ParseIntPipe()) languageId: number,
    @JwtDecorator() userData: JwtPayload,
  ): Promise<WordResponseDto> {
    return this.wordService.getNextWord(languageId, userData.id);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: WordResponseDto })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<WordResponseDto> {
    return this.wordService.findById(id);
  }

  @Post(':id/right')
  @HttpCode(200)
  @ApiOkResponse({ type: WordResponseDto })
  right(
    @Param('id', new ParseIntPipe()) id: number,
    @Query('percent', new ParseIntPipe()) percent: number,
    @JwtDecorator() userData: JwtPayload,
  ): Promise<WordResponseDto> {
    return this.wordService.right(id, userData.id, percent);
  }

  @Post(':id/wrong')
  @HttpCode(200)
  @ApiOkResponse({ type: WordResponseDto })
  wrong(
    @Param('id', new ParseIntPipe()) id: number,
    @JwtDecorator() userData: JwtPayload,
  ): Promise<WordResponseDto> {
    return this.wordService.wrong(id, userData.id);
  }
}
