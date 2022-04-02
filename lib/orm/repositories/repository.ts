import { OnModuleInit, Type } from '@nestjs/common';
import { mapping } from 'cassandra-driver';
import { CassandraDriverAdapterService } from '../../services';

import { getOptions } from '../utils/decorator.utils';
import { transformEntity } from '../utils/transform-entity.utils';

export class Repository<Entity = any> implements OnModuleInit {
  private readonly model: CassandraDriverAdapterService;
  private readonly target: Type<Entity>;

  private mapper: mapping.ModelMapper<Entity>;
  private batch: (
    items: mapping.ModelBatchItem[],
    executionOptions?: string | mapping.MappingExecutionOptions | undefined,
  ) => Promise<mapping.Result<Entity>>;

  onModuleInit() {
    const options = getOptions(this.target.prototype);

    const mappingOptions: mapping.MappingOptions = {
      models: {
        [options.tableName]: {
          tables: [
            { name: options.tableName, isView: options.materializedView },
          ],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };

    const mapper = this.model.createMapper(mappingOptions);

    this.mapper = mapper.forModel(options.tableName);
    this.batch = mapper.batch;
  }

  create(entity?: Partial<Entity>): Entity;

  create(entityLikeArray: Partial<Entity>[]): Entity[];

  create(entityLike?: any): Entity | Entity[] {
    return transformEntity(this.target, entityLike);
  }

  async findOne(
    entity: FindQuery<Entity>,
    options: mapping.FindDocInfo = {},
  ): Promise<Entity | null> {
    return this.mapper
      .get(entity, options, { logged: true })
      .then((x) => x && transformEntity(this.target, x));
  }

  async find(
    entity: FindQuery<Entity>,
    options?: mapping.FindDocInfo,
  ): Promise<Entity[]> {
    return this.mapper
      .find(entity, options, { logged: true })
      .then((x) => x.toArray().map((e) => transformEntity(this.target, e)));
  }

  async save(
    entity: Partial<Entity> | Partial<Entity>[],
    options: mapping.InsertDocInfo = {},
  ): Promise<Entity | Entity[]> {
    const saveFunc = async (entity: Entity) => {
      console.log('this.mapper', this.mapper);
      await this.mapper.insert(entity, options);
      return transformEntity(this.target, entity);
    };

    const saveMultipleFunc = async (arrayEntity: Entity[]) => {
      await Promise.all(
        arrayEntity.map((e) => this.mapper.insert(entity, options)),
      );

      return arrayEntity.map((e) => transformEntity(this.target, e));
    };

    return Array.isArray(entity)
      ? saveMultipleFunc(entity as any)
      : saveFunc(entity as any);
  }
}

export type FindQuery<T> = {
  [P in keyof T]?: T[P] | FindQueryStatic<T>;
} & FindQueryStatic<T>;

export type FindQueryStatic<T> = Partial<
  Record<keyof T, mapping.q.QueryOperator>
>;
