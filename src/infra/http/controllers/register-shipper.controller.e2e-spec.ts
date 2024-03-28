import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { AdminFactory } from 'test/factories/makeAdmin';

describe(`Register shipper (E2E)`, () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /shippers', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      id: 'admin-id',
      cpf: new Cpf('123.456.789-09'),
      password: await hash('123456', 8),
    });

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const response = await request(app.getHttpServer())
      .post('/shippers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cpf: '853.444.140-56',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    const shipperOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '853.444.140-56',
        role: Role.Shipper,
      },
    });

    expect(shipperOnDatabase).not.toBeNull();
  });
});
