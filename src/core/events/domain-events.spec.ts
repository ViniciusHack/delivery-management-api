import { vi } from 'vitest';

import { AggregateRoot } from '../aggregate-root';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId() {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    return aggregate;
  }
}

describe('Domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn();

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    DomainEvents.dispatch(new CustomAggregateCreated(CustomAggregate.create()));

    expect(callbackSpy).toHaveBeenCalled();
  });
});
