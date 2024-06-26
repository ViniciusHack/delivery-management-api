import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/makeAdmin';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`List shippers (E2E)`, () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let shipperFactory: ShipperFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, ShipperFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    shipperFactory = moduleRef.get(ShipperFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /shippers', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const token = jwtService.sign({
      sub: admin.id,
      role: Role.Admin,
    });

    const shipper1 = await shipperFactory.makePrismaShipper({
      cpf: new Cpf('58574881090'),
    });

    await Promise.all([
      shipperFactory.makePrismaShipper({
        cpf: new Cpf('85344414056'),
      }),
      shipperFactory.makePrismaShipper({
        cpf: new Cpf('64944247087'),
      }),
    ]);

    const perPage = 2;

    const response = await request(app.getHttpServer())
      .get(`/shippers?perPage=${perPage}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.shippers).toHaveLength(perPage);

    expect(response.body.shippers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: shipper1.id,
          cpf: '585.748.810-90',
          createdAt: expect.any(String),
        }),
      ]),
    );
  });
});
