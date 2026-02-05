import { Injectable } from '@nestjs/common'; // Aca estamos importando el decorador Injectable de NestJS. Este decorador se utiliza para marcar una clase como un proveedor que puede ser inyectado como una dependencia en otras partes de la aplicación.

@Injectable()
export class HealthService {}
