import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SessionInfo } from './session.provider';
import { CreateSessionDto } from './dto';

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
}
