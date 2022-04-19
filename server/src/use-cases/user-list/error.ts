import { UseCaseError } from '@use-cases/error';

class UserListError extends UseCaseError {
  constructor(errors: string[]) {
    super(errors);
    this.name = 'UserListError';
  }
}

export default UserListError;