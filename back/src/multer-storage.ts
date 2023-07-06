import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { createWriteStream } from 'fs';
import { StorageEngine } from 'multer';
import { ParsedQs } from 'qs';

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
    console.log('_handleFile', req.params.uuid, file);
    const fileUUID = req.params.uuid;

    FileRepository.set(fileUUID, file);
    file.stream.on('end', () => {
      console.log(`File ${fileUUID} transfer completed: ${file.originalname}`);
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
}
