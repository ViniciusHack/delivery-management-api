import { RecipientsRepository } from '@/domain/notifications/repositories/recipients-repository';
import { Injectable } from '@nestjs/common';
import { RecipientMapper } from '../mappers/prisma-recipient-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const recipient = await this.prisma.addressee.findUnique({
      where: {
        id,
      },
    });

    return recipient ? RecipientMapper.toDomain(recipient) : null;
  }
}
