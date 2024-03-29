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

describe(`Register addressee (E2E)`, () => {
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

  test('[POST] /addressees', async () => {
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
      .post('/addressees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'johndoe@test.com',
        city: 'Goiatins',
        street: 'Praça Aprígio Cavalcante, s/n',
        number: '70',
        neighborhood: 'Setor Central',
        state: 'TO',
        country: 'BR',
        zipCode: '77770-970',
      });

    expect(response.statusCode).toBe(201);

    const addresseeOnDatabase = await prisma.addressee.findUnique({
      where: {
        email: 'johndoe@test.com',
      },
    });

    expect(addresseeOnDatabase).not.toBeNull();
  });
});
