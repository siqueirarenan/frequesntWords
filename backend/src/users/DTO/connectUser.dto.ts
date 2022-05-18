import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserConnectDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
