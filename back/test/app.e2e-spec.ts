import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 } from 'uuid';
import { readFileSync } from 'fs';

// Beware! These test-cases are stateful and must run with --runInBand
describe('AppController (e2e)', () => {
  let app: INestApplication & {
    TEST_SESSION_DATA: any;
    UUIDV4_REX: RegExp;
    pin?: string;
    fileguid?: string;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.TEST_SESSION_DATA = {
      filelist: [
        {
          name: 'file1.jpg',
          size: 12345,
        },
        {
          name: 'file2.jpg',
          size: 34567,
        },
      ],
    };
    app.UUIDV4_REX =
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  });

  // it('/session/create (POST)', async () => {
  //   const createSessionResponse = await request(app.getHttpServer())
  //     .post('/session/create')
  //     .send({ invalidDto: {} })
  //     .expect(500);
  // });

  it('/session/create (POST)', async () => {
    const createSessionResponse = await request(app.getHttpServer())
      .post('/session/create')
      .send(app.TEST_SESSION_DATA)
      .expect(201);

    const pin = createSessionResponse.body.pin;
    console.log(`Session info: ${createSessionResponse.body}`);

    expect(pin).toMatch(/^\d{6}$/);

    app.pin = pin;

    // all files have a valid length prop
    expect(createSessionResponse.body.filelist).toHaveLength(
      app.TEST_SESSION_DATA.filelist.length,
    );

    // all files obtained a uuid
    createSessionResponse.body.filelist.forEach((fileInfo) => {
      expect(fileInfo.uuid).toMatch(app.UUIDV4_REX);
    });
  });

  it('/session/:pin (GET)', async () => {
    const getSessionResponse = await request(app.getHttpServer())
      .get(`/session/${app.pin}`)
      .expect(200);

    // returned session info pin is correct
    expect(getSessionResponse.body.pin).toBe(app.pin);

    // all files have a valid length prop
    expect(getSessionResponse.body.filelist).toHaveLength(
      app.TEST_SESSION_DATA.filelist.length,
    );

    // all files obtained a uuid
    getSessionResponse.body.filelist.forEach((fileInfo) => {
      expect(fileInfo.uuid).toMatch(app.UUIDV4_REX);
    });
  });

  it('/upload/:guid (POST)', async () => {
    const guid = v4();
    app.fileguid = guid;

    const content = `Hello, I'm a test file!`;
    const buffer = Buffer.from(content);

    const httpServer = app.getHttpServer();

    const uploadRequest = request(httpServer)
      .post(`/upload/${guid}`)
      .set({ connection: 'keep-alive' })
      .attach('filecontent', buffer, {
        filename: 'testfile.txt',
        contentType: 'text/plain; charset=utf-8',
      })
      .end(() => {});

    await new Promise((res) => setTimeout(() => res(42), 1000));

    console.log('Await http get');

    const response = await request(httpServer)
      .get(`/download/${guid}`)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200);

    expect(response.text).toMatch(content);
  });
});
