import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { createWriteStream } from 'fs';
import { StorageEngine } from 'multer';
import { ParsedQs } from 'qs';
import { SessionProvider } from './session.provider';
import { BadRequestException } from '@nestjs/common';

type ExpressRequest = Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
>;

type MulterCallback = (
  error?: any,
  info?: Partial<Express.Multer.File>,
) => void;

export const FileRepository = new Map<string, Express.Multer.File>();

export default class MulterStorage implements StorageEngine {
  _handleFile(
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: MulterCallback,
  ): void {
    const { pin, uuid } = req.params;
    console.log(`_handleFile ${pin}/${uuid}`, file);

    const session = this.sessions.getSession(pin);
    if (!session) throw new BadRequestException(`invalid pin: ${pin}`);

    if (!session.filelist.some((f) => f.uuid === uuid))
      throw new BadRequestException(`invalid pin: ${pin} or uuid: ${uuid}`);

    FileRepository.set(uuid, file);
    file.stream.on('end', () => {
      console.log(`File ${uuid} transfer completed: ${file.originalname}`);
      cb();
    });
  }

  _removeFile(
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: (error: Error) => void,
  ): void {
    console.log(`_removeFile callback is called`);
    cb(null);
  }

  private sessions = SessionProvider.getInstance();
}
