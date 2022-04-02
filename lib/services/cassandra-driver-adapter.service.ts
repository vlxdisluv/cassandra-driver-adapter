import { Inject, Injectable } from '@nestjs/common';
import { Client, mapping } from 'cassandra-driver';
import { CASSANDRA_DRIVER_ADAPTER_MODULE_OPTIONS } from '../cassandra-driver-adapter.constants';
import { CassandraDriverAdapterModuleOptions } from '../interfaces';

@Injectable()
export class CassandraDriverAdapterService {
  client: Client;

  constructor(
    @Inject(CASSANDRA_DRIVER_ADAPTER_MODULE_OPTIONS)
    private readonly options: CassandraDriverAdapterModuleOptions,
  ) {
    this.client = new Client(this.options);

    this.client.execute('select * from messages limit 1');
  }

  createMapper(mappingOptions: mapping.MappingOptions) {
    const mapper = new mapping.Mapper(this.client, mappingOptions);
    mapper.batch = mapper.batch.bind(this);
    return mapper;
  }
}
