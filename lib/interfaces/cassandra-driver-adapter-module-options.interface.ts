import { ModuleMetadata, Type } from '@nestjs/common';
import { DseClientOptions } from 'cassandra-driver';

export declare type CassandraDriverAdapterModuleOptions = DseClientOptions;

export interface CassandraDriverAdapterOptionsFactory {
  createCassandraDriverAdapterOptions():
    | Promise<CassandraDriverAdapterModuleOptions>
    | CassandraDriverAdapterModuleOptions;
}

export interface CassandraDriverAdapterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<CassandraDriverAdapterModuleOptions>
    | CassandraDriverAdapterModuleOptions;
  useClass?: Type<CassandraDriverAdapterOptionsFactory>;
  inject?: any[];
}
