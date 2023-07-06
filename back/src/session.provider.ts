import { v4 } from 'uuid';
import { FileInfoDto } from './dto';

const generatePIN = (): string => {
  let pin = 'xxxxxx';
  while (pin.includes('x')) {
    pin = pin.replace('x', `${Math.floor(Math.random() * 10)}`);
  }
  return pin;
};

export interface FileInfo extends FileInfoDto {
  uuid: string;
}

export interface SessionInfo {
  pin: string;
  fileInfoList: FileInfo[];
  context: any;
}

export class SessionProvider {
  private constructor() {}

  static getInstance(): SessionProvider {
    if (!SessionProvider.instance) {
      SessionProvider.instance = new SessionProvider();
    }
    return SessionProvider.instance;
  }

  createSession(fileInfoList: FileInfoDto[], context: any = null): SessionInfo {
    const pin = generatePIN();
   
    const sessionInfo: SessionInfo = {
      pin,
      fileInfoList: fileInfoList.map((info) => ({ uuid: v4(), ...info })),
      context: context,
    };

    this.sessions.set(pin, sessionInfo);

    return sessionInfo;
  }

  getSession(pin: string): SessionInfo | null {
    return this.sessions.get(pin) || null;
  }

  private static instance: SessionProvider;
  private sessions: Map<string, SessionInfo> = new Map<string, SessionInfo>();
}
