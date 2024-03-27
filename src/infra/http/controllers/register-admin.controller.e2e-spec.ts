import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Register Admin (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /admins', async () => {
    const response = await request(app.getHttpServer()).post('/admins').send({
      cpf: '123.456.789-09',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    const admin = await prisma.user.findUnique({
      where: {
        cpf: '123.456.789-09',
        role: 'ADMIN',
      },
    });

    expect(admin).not.toBeNull();
  });
});
