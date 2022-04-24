class DbError extends Error {
    errors: string[] = [];

    constructor(errors: string[]) {
      super();
      this.errors = errors;
    }
}

export default DbError;