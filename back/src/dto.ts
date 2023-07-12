import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class FileInfoDto {
  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  uuid?: string;
}

export class SessionDto {
  @IsOptional()
  @IsString()
  pin: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FileInfoDto)
  filelist: FileInfoDto[];
}
