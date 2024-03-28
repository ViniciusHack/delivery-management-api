import { Shipper } from '@/domain/administration/entities/shipper';

export class ShipperPresenter {
  static toHTTP(shipper: Shipper) {
    return {
      id: shipper.id,
      cpf: shipper.cpf.toMaskedString(),
      createdAt: shipper.createdAt,
    };
  }
}
