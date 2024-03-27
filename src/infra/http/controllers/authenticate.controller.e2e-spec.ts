import { AppModule } from '@/app.module';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { AdminFactory } from 'test/factories/makeAdmin';

describe('Authenticate user (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    await app.init();
  });

  test('[POST] /sessions', async () => {
    await adminFactory.makePrismaAdmin({
      cpf: new Cpf('123.456.789-09'),
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: '123.456.789-09',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);
  });
});
