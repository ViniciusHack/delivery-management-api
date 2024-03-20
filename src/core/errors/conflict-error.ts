export class ConflictError extends Error {
  constructor(entity: string) {
    super(`${entity} already exists`);
  }
}
