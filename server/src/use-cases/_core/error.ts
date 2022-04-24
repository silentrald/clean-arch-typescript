class UseCaseError extends Error {
  readonly errors: string[] = [];

  constructor(errors: string[]) {
    super();

    this.errors = errors;
  }
}

export default UseCaseError;
