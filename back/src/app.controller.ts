import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SessionInfo } from './session.provider';
import { CreateSessionDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

import MulterStorage, { FileRepository } from './multer-storage';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/session/:pin')
  getSession(@Param('pin') pin: string): SessionInfo {
    return this.appService.getSession(pin);
  }

  @Post('/session/create')
  async createSession(@Body() body: CreateSessionDto): Promise<SessionInfo> {
    console.log('body', body);
    return this.appService.createSession(body.filelist);
  }

  @Post('/upload/:uuid')
  @UseInterceptors(
    FileInterceptor('filecontent', {
      storage: new MulterStorage(),
    }),
  )
  async uploadFile(
    @Param('uuid') uuid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(`upload file: ${uuid}`, file);
    return { status: 'ok' };
  }

  @Get('/download/:uuid')
  async downloadFile(@Param('uuid') uuid: string, @Res() res: Response) {
    const file = FileRepository.get(uuid);
    if (!file) throw new BadRequestException('invalid file uuid');

    res.set('Content-Type', file.mimetype);
    res.set('Transfer-Encoding: chunked');
    res.set(
      'Content-Disposition',
      `attachment; filename="${file.originalname}"`,
    );

    file.stream.pipe(res);
  }
}
