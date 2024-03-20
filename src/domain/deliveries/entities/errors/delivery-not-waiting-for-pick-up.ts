export class DeliveryNotWaitingPickUpError extends Error {
  constructor() {
    super('Delivery is not waiting to be picked up');
    this.name = 'DeliveryNotWaitingPickUpError';
  }
}
