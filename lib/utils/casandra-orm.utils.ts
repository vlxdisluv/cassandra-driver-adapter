import { Repository } from '../orm';

export function getRepositoryToken(entity: Function): string {
  if (entity.prototype instanceof Repository) {
    return entity.name;
  }
  return `${entity.name}Repository`;
}
