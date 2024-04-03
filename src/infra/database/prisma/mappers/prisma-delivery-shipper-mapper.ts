import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { Shipper } from '@/domain/deliveries/entities/shipper';
import { User } from '@prisma/client';

export class PrismaShipperMapper {
  static toDomain(shipper: User): Shipper {
    return new Shipper(
      {
        cpf: new Cpf(shipper.cpf),
        password: shipper.password,
      },
      shipper.id,
    );
  }
}
