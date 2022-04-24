import { EntityError } from '@entities/error';

class UserError extends EntityError {
  constructor(errors: string[]) {
    super(errors);
  }
}

export default UserError;
