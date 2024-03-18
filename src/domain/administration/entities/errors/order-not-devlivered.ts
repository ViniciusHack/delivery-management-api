export class OrderNotDeliveredError extends Error {
  constructor() {
    super('Order is not delivered yet');
    this.name = 'OrderNotDeliveredError';
  }
}
