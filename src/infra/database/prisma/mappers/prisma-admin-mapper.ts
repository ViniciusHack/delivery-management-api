import { Admin } from '@/domain/administration/entities/admin';
import { Cpf } from '@/domain/administration/entities/value-objects/cpf';
import { Prisma, User } from '@prisma/client';

export class PrismaAdminMapper {
  static toDomain(admin: User): Admin {
    return new Admin(
      {
        cpf: new Cpf(admin.cpf),
        password: admin.password,
      },
      admin.id,
    );
  }

  static toPersistence(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id,
      cpf: admin.cpf.toString(),
      password: admin.password,
      role: 'ADMIN',
    };
  }
}
