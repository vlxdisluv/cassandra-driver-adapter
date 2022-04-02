import { Provider } from '@nestjs/common';
import { Repository } from './orm';
import { RepositoryFactory } from './orm/repositories/repository.factory';
import { getEntity } from './orm/utils/decorator.utils';
import { CassandraDriverAdapterService } from './services';
import { getRepositoryToken } from './utils/casandra-orm.utils';

export function createCassandraDriverAdapterServiceProviders(
  entities?: Function[],
) {
  const provideRepository = (entity) => ({
    provide: getRepositoryToken(entity),
    useFactory: async (model) => RepositoryFactory.create(entity, model),
    inject: [CassandraDriverAdapterService],
  });

  const provideCustomRepository = (EntityRepository) => {
    const entity = getEntity(EntityRepository);

    return {
      provide: getRepositoryToken(EntityRepository),
      useFactory: async (model) =>
        RepositoryFactory.create(entity, model, EntityRepository),
      inject: [CassandraDriverAdapterService],
    };
  };

  const providers: Provider[] = [];
  (entities || []).forEach((entity) => {
    if (entity.prototype instanceof Repository) {
      return providers.push(provideCustomRepository(entity));
    }
    return providers.push(provideRepository(entity));
  });

  return [...providers];
}
