class EntityError extends Error {
  readonly errors: string[] = [];

  constructor(errors: string[]) {
    super();
    this.errors = errors;
    this.message = this.errors.join('; ');
  }
}

export default EntityError;