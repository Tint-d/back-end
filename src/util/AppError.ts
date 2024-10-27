export class AppError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 500;
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export class BadRequest extends AppError {
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFound extends AppError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class Unauthorized extends AppError {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class Forbidden extends AppError {
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
