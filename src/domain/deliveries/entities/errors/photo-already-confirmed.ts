export class PhotoAlreadyConfirmedError extends Error {
  constructor() {
    super('Photo is already confirmed');
    this.name = 'PhotoAlreadyConfirmedError';
  }
}
