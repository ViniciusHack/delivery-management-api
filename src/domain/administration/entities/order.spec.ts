import { OrderNotWaitingToBePickedUpError } from './errors/order-not-waiting-to-be-picked-up';
import { Order } from './order';

describe('Order Entity', () => {
  it('should be able to create an order', () => {
    const order = new Order({
      addresseeId: '123',
    });

    expect(order.stage).toBe('IN_ANALYSIS');
  });

  it('should be able to turn an order to the waiting stage', () => {
    const order = new Order({
      addresseeId: '123',
    });

    order.ready();
    expect(order.stage).toBe('WAITING');
  });

  it('should not be able to turn an order to the waiting stage if it`s in a inappropriate stage', () => {
    const order = new Order({
      addresseeId: '123',
      stage: 'DELIVERED',
      updatedAt: new Date(),
    });

    expect(() => order.ready()).toThrowError(OrderNotWaitingToBePickedUpError);
  });

  it('should be able to get the delivered date of an order', () => {
    const order = new Order({
      addresseeId: '123',
      stage: 'DELIVERED',
      updatedAt: new Date(),
    });

    expect(order.deliveryDate).toBeInstanceOf(Date);
  });

  it('should not be able to get the delivered date of an Order if it has no updated date', () => {
    const order = new Order({
      addresseeId: '123',
      stage: 'DELIVERED',
      createdAt: new Date(),
    });

    expect(() => order.deliveryDate).toThrowError('Order has no updated date');
  });
});
