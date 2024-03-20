export class DeliveryAlreadyReturnedError extends Error {
  constructor() {
    super('Delivery is not on the way to be able to return');
    this.name = 'DeliveryAlreadyReturnedError';
  }
}
