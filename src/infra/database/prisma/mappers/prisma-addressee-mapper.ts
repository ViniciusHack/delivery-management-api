import { Addressee } from '@/domain/administration/entities/addressee';
import { Address } from '@/domain/administration/entities/value-objects/address';
import { Prisma, Addressee as PrismaAddressee } from '@prisma/client';

export class PrismaAddresseeMapper {
  static toDomain(addressee: PrismaAddressee): Addressee {
    return new Addressee(
      {
        address: new Address({
          ...addressee,
        }),
        email: addressee.email,
      },
      addressee.id,
    );
  }

  static toPersistence(
    addressee: Addressee,
  ): Prisma.AddresseeUncheckedCreateInput {
    return {
      id: addressee.id,
      email: addressee.email,
      ...addressee.address,
    };
  }
}
