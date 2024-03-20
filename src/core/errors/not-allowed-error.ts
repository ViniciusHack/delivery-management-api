export class NotAllowedError extends Error {
  constructor() {
    super('Not allowed');
    this.name = 'NotAllowedError';
  }
}
