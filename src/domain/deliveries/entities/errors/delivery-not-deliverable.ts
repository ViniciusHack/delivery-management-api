export class DeliveryNotDeliverableError extends Error {
  constructor() {
    super('Delivery is not on the way to be able to deliver');
    this.name = 'DeliveryNotDeliverableError';
  }
}
