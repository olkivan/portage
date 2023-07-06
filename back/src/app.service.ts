import { Injectable } from '@nestjs/common';
import { SessionInfo, SessionProvider } from './session.provider';
import { FileInfoDto } from './dto';

@Injectable()
export class AppService {
  private sessionProvider = SessionProvider.getInstance();
  
  getSession(pin: string) : SessionInfo | null {
    return this.sessionProvider.getSession(pin);
  }

  createSession(fileInfoList: FileInfoDto[]): SessionInfo {
    console.log(`app.service.createSession(${fileInfoList})`);

    return this.sessionProvider.createSession(fileInfoList);
  }
}
