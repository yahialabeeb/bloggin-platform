import { NotFoundException } from '@nestjs/common';
export const NotFoundHandler = ({ result, action }) => {
  if (
    (action === 'find' && result?.id) ||
    (action !== 'find' && result?.affected)
  ) {
    return result;
  } else {
    throw new NotFoundException();
  }
};
