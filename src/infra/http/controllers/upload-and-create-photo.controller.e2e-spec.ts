import { AppModule } from '@/app.module';
import { Role } from '@/core/permissions';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ShipperFactory } from 'test/factories/makeShipper';

describe(`Upload and create photo (E2E)`, () => {
  let app: INestApplication;
  let shipperFactory: ShipperFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ShipperFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    shipperFactory = moduleRef.get(ShipperFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /photos', async () => {
    const shipper = await shipperFactory.makePrismaShipper();

    const token = jwtService.sign({
      sub: shipper.id,
      role: Role.Shipper,
    });

    const response = await request(app.getHttpServer())
      .post('/photos')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', 'test/fixtures/attachment.jpg');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });
});
