import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class FileInfoDto {
  @IsString()
  name: string;
  @IsNumber()
  size: number;
}

export class CreateSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileInfoDto)
  filelist: FileInfoDto[];
}
