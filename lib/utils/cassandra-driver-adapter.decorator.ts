import { Inject } from '@nestjs/common';
import { getRepositoryToken } from './casandra-orm.utils';

export const InjectRepository = (entity: Function) =>
  Inject(getRepositoryToken(entity));
