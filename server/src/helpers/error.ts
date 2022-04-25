import DbError from '@db/_core/error';
import EntityError from '@entities/_core/error';
import UseCaseError from '@use-cases/_core/error';

export const isApplicationError = (err: unknown): boolean => {
  return err instanceof EntityError ||
    err instanceof DbError ||
    err instanceof UseCaseError;
};