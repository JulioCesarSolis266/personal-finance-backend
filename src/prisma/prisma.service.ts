// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// //------- Extiende PrismaClient para que pueda ser inyectado como un servicio de NestJS -------//

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     //------- PrismaClient genera métodos dinámicamente; ESLint no puede inferir sus los tipos -------//
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     await this.$connect();
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      }),
    });
  }
}
