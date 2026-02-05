import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({//------- Módulo de salud para verificar el estado de la aplicación -------//
  controllers: [HealthController], // Aca estamos importando el controlador de salud
  providers: [HealthService], // Aca estamos importando el servicio de salud. Se pone providers y no services porque es la forma en que NestJS reconoce los servicios
})
export class HealthModule {}
