import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { compare, hash } from 'bcryptjs';
import request from 'supertest';
import { AdminFactory } from 'test/factories/makeAdmin';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`Change shippers's password (E2E)`, () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let shipperFactory: ShipperFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, ShipperFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    shipperFactory = moduleRef.get(ShipperFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /shippers/:id/password', async () => {
    const admin = await adminFactory.makePrismaAdmin({});

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const shipper = await shipperFactory.makePrismaShipper({
      cpf: new Cpf('853.444.140-56'),
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer())
      .patch(`/shippers/${shipper.id}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: '123456',
        newPassword: 'new-password',
      });

    expect(response.statusCode).toBe(200);

    const shipperOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '853.444.140-56',
        role: Role.Shipper,
      },
    });

    expect(shipperOnDatabase).not.toBeNull();

    const newPassword = await compare(
      'new-password',
      shipperOnDatabase?.password ?? '',
    );
    expect(newPassword).toBeTruthy();
  });
});
