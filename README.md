<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Cassandra Driver Adapter utilities module for [NestJS](https://github.com/nestjs/nest) based on the [cassandra-driver](https://github.com/datastax/nodejs-driver) package.

## Installation

```bash
$ npm i --save @vlxdisluv/cassandra-driver-adapter
```

```bash
$ yarn add @vlxdisluv/cassandra-driver-adapter
```

## Usage

Import `CassandraDriverAdapterModule`:

```typescript
@Module({
  imports: [
    CassandraDriverAdapterModule.forRootAsync({...})
  ],
  providers: [...]
})
export class AppModule {}
```

## Async options

Quite often you might want to asynchronously pass your module options instead of passing them beforehand. In such case, use registerAsync() method, that provides a couple of various ways to deal with async data.

**1. Use factory**

```typescript
CassandraDriverAdapterModule.forRootAsync({
  useFactory: () => ({...}),
})
```

Obviously, our factory behaves like every other one (might be `async` and is able to inject dependencies through `inject`).

```typescript
CassandraDriverAdapterModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => configService.getDbConfig(),
  inject: [ConfigService],
});
```

**2. Use class**

```typescript
CassandraDriverAdapterModule.forRootAsync({
  useClass: ConfigService,
});
```

Above construction will instantiate `ConfigService` inside `CassandraDriverAdapterModule` and will leverage it to create options object.

```typescript
class ConfigService implements CassandraDriverAdapterOptionsFactory {
  createCassandraDriverAdapterOptions(): CassandraDriverAdapterModuleOptions {
    return {...};
  }
}
```

**3. Use existing**

```typescript
CassandraDriverAdapterModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

It works the same as `useClass` with one critical difference - `CassandraDriverAdapterModule` will lookup imported modules to reuse already created ConfigService, instead of instantiating it on its own.

## ORM Options

```typescript
import { Entity } from '@vlxdisluv/cassandra-driver-adapter/lib/orm';

@Entity({
  tableName: 'messages',
})
export class Message {
  id: any;
  text: string;
}
```

Let's have a look at the `MessagesModule`

```typescript
import { Module } from '@nestjs/common';
import { CassandraDriverAdapterModule } from '@vlxdisluv/cassandra-driver-adapter';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './message.entity';

@Module({
  imports: [CassandraDriverAdapterModule.forFeature([Message])],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
```

## Using Repository

```typescript
import { Module } from '@nestjs/common';
import { CassandraDriverAdapterModule } from '@vlxdisluv/cassandra-driver-adapter';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './message.entity';

@Module({
  imports: [CassandraDriverAdapterModule.forFeature([Message])],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import {
  InjectRepository,
  Repository,
} from '@vlxdisluv/cassandra-driver-adapter';
import { Message } from './message.entity';
import { Observable } from 'rxjs';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  getById(id: id): Promise<PhotoEntity> {
    return this.messagesRepository.findOne({ id });
  }
}
```

## Using Custom Repository

Let's create a repository:

```typescript
import {
  Repository,
  EntityRepository,
} from '@vlxdisluv/cassandra-driver-adapter';
import { Message } from './message.entity';
import { Observable } from 'rxjs';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  findById(id: any): Message {
    return this.findOne({ id: id });
  }
}
```

## Stay in touch

- Author - [Vladislav Severin](https://github.com/vlxdisluv)
