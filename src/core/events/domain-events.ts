import { DomainEvent } from './domain-event';

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};

  public static shouldRun = true;

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers() {
    this.handlersMap = {};
  }

  public static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;

    const isEventRegistered = eventClassName in this.handlersMap;

    if (!this.shouldRun) return;

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
