class DbError extends Error {
  readonly errors: string[] = [];

  constructor(errors: string[]) {
    super();
    this.errors = errors;
    this.message = this.errors.join('; ');
  }
}

export default DbError;