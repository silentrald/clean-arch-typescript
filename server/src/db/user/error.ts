import DbError from '@db/_core/error';

export const userDbErrors = {
  invalidId: 'user_invalid_id',
  invalidPassword: 'user_invalid_password',
  missingId: 'user_missing_id',
  missingPassword: 'user_missing_password',
  notFound: 'user_not_found',
};

class UserDbError extends DbError {
  constructor(errors: string[]) {
    super(errors);
    this.name = 'UserDbError';
  }
}

export default UserDbError;