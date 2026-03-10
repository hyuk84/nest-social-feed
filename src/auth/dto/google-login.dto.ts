import { IsString, MinLength } from 'class-validator';

export class GogleLoginDto {
  @IsString()
  @MinLength(10)
  idToken!: string;
}
