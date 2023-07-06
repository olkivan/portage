import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// Beware! These test-cases are stateful and must run with --runInBand
describe('AppController (e2e)', () => {
  let app: INestApplication & {
    TEST_SESSION_DATA: any;
    UUIDV4_REX: RegExp;
    pin?: string;
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

  it('/session/create (POST)', async () => {
    const createSessionResponse = await request(app.getHttpServer())
      .post('/session/create')
      .send({ invalidDto: {} })
      .expect(500);
  });

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
    expect(createSessionResponse.body.fileInfoList).toHaveLength(
      app.TEST_SESSION_DATA.filelist.length,
    );

    // all files obtained a uuid
    createSessionResponse.body.fileInfoList.forEach((fileInfo) => {
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
    expect(getSessionResponse.body.fileInfoList).toHaveLength(
      app.TEST_SESSION_DATA.filelist.length,
    );

    // all files obtained a uuid
    getSessionResponse.body.fileInfoList.forEach((fileInfo) => {
      expect(fileInfo.uuid).toMatch(app.UUIDV4_REX);
    });
  });
});
