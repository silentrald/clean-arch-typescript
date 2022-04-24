import DbError from '@db/_core/error';

class UserDbError extends DbError {
  constructor(errors: string[]) {
    super(errors);
    this.name = 'UserDbError';
  }
}

export default UserDbError;