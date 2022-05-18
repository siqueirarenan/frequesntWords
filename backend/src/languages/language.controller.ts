import { Controller, Get, HttpCode, Param, ParseIntPipe } from '@nestjs/common';
import { LanguageService } from './language.service';
import ResponseLanguageDto from './DTO/responseLanguage.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from '../_common/filters/DTO/errorList.dto';

@ApiTags('Languages')
@Controller('languages')
@ApiNotFoundResponse({ type: ErrorDto })
@ApiBadRequestResponse({ type: ErrorDto })
export class LanguageController {
  constructor(private languageService: LanguageService) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: ResponseLanguageDto, isArray: true })
  getLanguages(): Promise<ResponseLanguageDto[]> {
    return this.languageService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: ResponseLanguageDto })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponseLanguageDto> {
    return this.languageService.findById(id);
  }
}
