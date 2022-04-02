import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { CASSANDRA_DRIVER_ADAPTER_MODULE_OPTIONS } from './cassandra-driver-adapter.constants';
import { createCassandraDriverAdapterServiceProviders } from './cassandra-driver-adapter.providers';
import {
  CassandraDriverAdapterModuleAsyncOptions,
  CassandraDriverAdapterOptionsFactory,
} from './interfaces';
import { CassandraDriverAdapterService } from './services';

@Global()
@Module({})
export class CassandraDriverAdapterModule {
  static defaultOptions = {
    contactPoints: ['127.0.0.1:9042'],
    localDataCenter: 'DC1',
    keyspace: 'scylla',
    monitorReporting: { enabled: true },
  };

  static forRootAsync(
    options: CassandraDriverAdapterModuleAsyncOptions,
  ): DynamicModule {
    console.log('options', options);
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: CassandraDriverAdapterModule,
      imports: options.imports,
      providers: [...asyncProviders, CassandraDriverAdapterService],
      exports: [CassandraDriverAdapterService],
    };
  }

  private static createAsyncProviders(
    options: CassandraDriverAdapterModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass =
      options.useClass as Type<CassandraDriverAdapterOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: CassandraDriverAdapterModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CASSANDRA_DRIVER_ADAPTER_MODULE_OPTIONS,
        useFactory: {
          ...CassandraDriverAdapterModule.defaultOptions,
          ...options.useFactory,
        } as any,
        inject: options.inject || [],
      };
    }

    const inject = [
      options.useClass as Type<CassandraDriverAdapterOptionsFactory>,
    ];

    return {
      provide: CASSANDRA_DRIVER_ADAPTER_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: CassandraDriverAdapterOptionsFactory,
      ) => {
        const options =
          await optionsFactory.createCassandraDriverAdapterOptions();
        return { ...CassandraDriverAdapterModule.defaultOptions, ...options };
      },
      inject,
    };
  }

  static forFeature(entities: Function[] = []): DynamicModule {
    const providers = createCassandraDriverAdapterServiceProviders(entities);

    return {
      module: CassandraDriverAdapterModule,
      providers,
      exports: providers,
    };
  }
}
