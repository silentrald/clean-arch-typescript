import EntityError from '@entities/_core/error';

class UserError extends EntityError {
  constructor(errors: string[]) {
    super(errors);
  }
}

export default UserError;
