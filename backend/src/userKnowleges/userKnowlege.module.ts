import { Module } from '@nestjs/common';
import { UserKnowlegeService } from './userKnowlege.service';
import { UserKnowlegeController } from './userKnowlege.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKnowlege } from './userKnowlege.entity';
import { UserKnowlegeRepo } from './userKnowlege.repository';
import { UserKnowlegeProfile } from './DTO/userKnowlege.profile';
import { CustomJwtModule } from '../auth/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserKnowlege]), CustomJwtModule],
  providers: [UserKnowlegeService, UserKnowlegeRepo, UserKnowlegeProfile],
  controllers: [UserKnowlegeController],
  exports: [UserKnowlegeRepo],
})
export class UserKnowlegeModule {}
