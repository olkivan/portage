import { Injectable } from '@nestjs/common';
import { FileInfo, SessionInfo, SessionProvider } from './session.provider';

@Injectable()
export class AppService {
  private sessionProvider = SessionProvider.getInstance();

  getSession(pin: string): SessionInfo | null {
    return this.sessionProvider.getSession(pin);
  }

  createSession(fileInfoList: FileInfo[]): SessionInfo {
    console.log(Array.isArray(fileInfoList));
    console.log(`app.service.createSession(${JSON.stringify(fileInfoList)})`);

    return this.sessionProvider.createSession(fileInfoList);
  }
}
