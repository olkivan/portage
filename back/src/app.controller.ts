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
import { SessionInfo, SessionProvider } from './session.provider';
import { SessionDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

import MulterStorage, { FileRepository } from './multer-storage';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/sessions/:pin')
  getSession(@Param('pin') pin: string): SessionInfo {
    return this.appService.getSession(pin);
  }

  @Post('/sessions')
  async createSession(@Body() body: SessionDto): Promise<SessionDto | null> {
    console.log('body', body);
    const sessionInfo = this.appService.createSession(body.filelist);
    if (!sessionInfo) return null;
    const { context, ...sessionInfoDto } = sessionInfo;
    return sessionInfoDto;
  }

  @Post('/files/:pin/:uuid')
  @UseInterceptors(
    FileInterceptor('filecontent', {
      storage: new MulterStorage(),
    }),
  )
  async uploadFile(
    @Param('pin') pin: string,
    @Param('uuid') uuid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(`upload file: ${pin}/${uuid}`, file);
    return { status: 'ok' };
  }

  @Get('/files/:pin/:uuid')
  async downloadFile(
    @Param('pin') pin: string,
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    const session = this.sessions.getSession(pin);
    if (!session) throw new BadRequestException(`invalid pin: ${pin}`);

    if (!session.filelist.some((f) => f.uuid === uuid))
      throw new BadRequestException(`invalid pin: ${pin} or uuid: ${uuid}`);

    const file = FileRepository.get(uuid);
    if (!file) throw new BadRequestException(`invalid uuid: ${uuid}`);

    res.set('Content-Type', file.mimetype);
    res.set('Transfer-Encoding: chunked');
    res.set(
      'Content-Disposition',
      `attachment; filename="${file.originalname}"`,
    );

    file.stream.pipe(res);
  }

  private sessions = SessionProvider.getInstance();
}
