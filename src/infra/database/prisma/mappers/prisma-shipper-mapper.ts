import { Role } from '@/core/permissions';
import { Shipper } from '@/domain/administration/entities/shipper';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { Prisma, User } from '@prisma/client';

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

  static toPersistence(shipper: Shipper): Prisma.UserUncheckedCreateInput {
    return {
      id: shipper.id,
      cpf: shipper.cpf.toString(),
      password: shipper.password,
      role: Role.Shipper,
    };
  }
}
