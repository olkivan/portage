import { v4 } from 'uuid';

const generatePIN = (): string => {
  let pin = 'xxxxxx';
  while (pin.includes('x')) {
    pin = pin.replace('x', `${Math.floor(Math.random() * 10)}`);
  }
  return pin;
};

export interface FileInfo {
  name: string;
  size: number;
  uuid?: string;
}

export interface SessionInfo {
  pin: string;
  filelist: FileInfo[];
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

  createSession(filelist: FileInfo[], context: any = null): SessionInfo {
    const pin = generatePIN();

    const sessionInfo: SessionInfo = {
      pin,
      filelist: filelist.map((info) => ({ uuid: v4(), ...info })),
      context: context,
    };

    this.sessions.set(pin, sessionInfo);

    return sessionInfo;
  }

  hasSession(pin: string): boolean {
    return this.sessions.has(pin);
  }

  getSession(pin: string): SessionInfo | null {
    return this.sessions.get(pin) || null;
  }

  private static instance: SessionProvider;
  private sessions: Map<string, SessionInfo> = new Map<string, SessionInfo>();
}
