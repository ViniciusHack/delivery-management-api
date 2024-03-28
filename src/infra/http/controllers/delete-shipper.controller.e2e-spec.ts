import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/makeAdmin';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`Register shipper (E2E)`, () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let shipperFactory: ShipperFactory;

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

  test('[POST] /shippers', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      cpf: new Cpf('85344414056'),
    });

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const shipper = await shipperFactory.makePrismaShipper();

    const response = await request(app.getHttpServer())
      .delete(`/shippers/${shipper.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);

    const shipperOnDatabase = await prisma.user.findUnique({
      where: {
        id: shipper.id,
        role: Role.Shipper,
      },
    });

    expect(shipperOnDatabase).toBeNull();
  });
});
