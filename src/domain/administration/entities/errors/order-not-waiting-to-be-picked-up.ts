export class OrderNotWaitingToBePickedUpError extends Error {
  constructor() {
    super('Order is not waiting to be picked up');
    this.name = 'OrderNotWaitingToBePickedUpError';
  }
}
