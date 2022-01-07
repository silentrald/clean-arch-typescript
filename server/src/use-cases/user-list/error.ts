

class UserListError extends Error {
    code: number;

    constructor(code: number) {
      super();

      this.code = code;
    }
}

export default UserListError;