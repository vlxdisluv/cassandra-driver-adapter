import { CassandraDriverAdapterService } from '../../services';
import { Repository } from './repository';

export class RepositoryFactory {
  static create<T>(
    entity: Function,
    model: CassandraDriverAdapterService,
    EntityRepository = Repository,
  ): Repository<T> {
    const repository = new EntityRepository();

    Object.assign(repository, {
      target: entity,
      model,
    });

    return repository;
  }
}
