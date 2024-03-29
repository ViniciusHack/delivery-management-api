import { Addressee } from '@/domain/administration/entities/addressee';
import { AddresseesRepository } from '@/domain/administration/repositories/addressees-repository';
import { Injectable } from '@nestjs/common';
import { PrismaAddresseeMapper } from '../mappers/prisma-addressee-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAddresseesRepository implements AddresseesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const addressee = await this.prisma.addressee.findUnique({
      where: {
        id,
      },
    });

    return addressee ? PrismaAddresseeMapper.toDomain(addressee) : null;
  }

  async findByEmail(email: string) {
    const addressee = await this.prisma.addressee.findUnique({
      where: {
        email,
      },
    });

    return addressee ? PrismaAddresseeMapper.toDomain(addressee) : null;
  }

  async create(addressee: Addressee) {
    await this.prisma.addressee.create({
      data: PrismaAddresseeMapper.toPersistence(addressee),
    });
  }

  async update(addressee: Addressee) {
    await this.prisma.addressee.update({
      where: {
        id: addressee.id,
      },
      data: PrismaAddresseeMapper.toPersistence(addressee),
    });
  }

  async delete(id: string) {
    await this.prisma.addressee.delete({
      where: {
        id,
      },
    });
  }
}
