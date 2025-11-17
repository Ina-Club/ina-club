export class UnauthorizedError extends Error {
  constructor(message = "User Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
