import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

type TestAppContext = Partial<{
  TEST_SESSION_DATA: {
    filelist: { name: string; size: number; uuid?: string }[];
  };
  TEST_CONTENT: string;
  TEST_UUIDV4_REX: RegExp;
  TEST_PIN: string;
}>;

// Beware! These test-cases are stateful and must run with --runInBand
describe('AppController (e2e)', () => {
  let app: INestApplication & TestAppContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.TEST_CONTENT = `Hello, I'm a test file!`;
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
        {
          name: 'file3.txt',
          size: 56789,
        },
      ],
    };
    app.TEST_UUIDV4_REX =
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  });

  it('/sessions (POST)', async () => {
    const createSessionResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({ invalidDto: {} })
      .expect(500);
  });

  it('/session (POST)', async () => {
    const createSessionResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send(app.TEST_SESSION_DATA)
      .expect(201);

    const pin = createSessionResponse.body.pin;
    console.log(`Session info: ${createSessionResponse.body}`);

    expect(pin).toMatch(/^\d{6}$/);

    app.TEST_PIN = pin;

    // all files have a valid length prop
    expect(createSessionResponse.body.filelist).toHaveLength(
      app.TEST_SESSION_DATA.filelist.length,
    );

    // all files obtained a uuid
    createSessionResponse.body.filelist.forEach((fileInfo) => {
      expect(fileInfo.uuid).toMatch(app.TEST_UUIDV4_REX);
    });
  });

  it('/sessions/:pin (GET)', async () => {
    const getSessionResponse = await request(app.getHttpServer())
      .get(`/sessions/${app.TEST_PIN}`)
      .expect(200);

    // returned session info pin is correct
    expect(getSessionResponse.body.pin).toBe(app.TEST_PIN);

    // all files have a valid length prop
    expect(getSessionResponse.body.filelist).toHaveLength(
      app.TEST_SESSION_DATA.filelist.length,
    );

    // all files obtained a uuid
    getSessionResponse.body.filelist.forEach((fileInfo, i) => {
      expect(fileInfo.uuid).toMatch(app.TEST_UUIDV4_REX);
    });

    // populate global test suite data
    getSessionResponse.body.filelist.forEach((fileInfo, i) => {
      app.TEST_SESSION_DATA.filelist[i].uuid = fileInfo.uuid;
    });
  });

  it('/files/:pin/:guid (POST and Get)', async () => {
    const buffer = Buffer.from(app.TEST_CONTENT);

    const httpServer = app.getHttpServer();

    const TEST_FILE_NAME = 'file3.txt';
    const fileInfo = app.TEST_SESSION_DATA.filelist.find(
      (f: { name: string; size: number }) => f.name === TEST_FILE_NAME,
    );

    expect(fileInfo !== undefined);

    // initiate upload request
    request(httpServer)
      .post(`/files/${app.TEST_PIN}/${fileInfo.uuid}`)
      .set({ connection: 'keep-alive' })
      .attach('filecontent', buffer, {
        filename: fileInfo.name,
        contentType: 'text/plain; charset=utf-8',
      })
      .end(() => {});

    // wait a sec and let event loop run
    await new Promise((res) => setTimeout(() => res(42), 1000));

    // initiate download
    const response = await request(httpServer)
      .get(`/files/${app.TEST_PIN}/${fileInfo.uuid}`)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200);

    // content should match
    expect(response.text).toMatch(app.TEST_CONTENT);
  });
});
