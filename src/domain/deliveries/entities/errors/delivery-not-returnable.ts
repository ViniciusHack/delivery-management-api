export class DeliveryNotReturnableError extends Error {
  constructor() {
    super('Delivery is not on the way to be able to return');
    this.name = 'DeliveryNotReturnableError';
  }
}
