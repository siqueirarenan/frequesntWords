import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './language.entity';
import { LanguageRepo } from './language.repository';
import { LanguageProfile } from './DTO/language.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageService, LanguageRepo, LanguageProfile],
  controllers: [LanguageController],
  exports: [LanguageRepo],
})
export class LanguageModule {}
