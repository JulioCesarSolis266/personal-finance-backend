import { Controller } from '@nestjs/common'; // Aca estamos importando el decorador Controller de NestJS. Este decorador se utiliza para definir un controlador en la aplicación, que maneja las solicitudes entrantes y devuelve las respuestas al cliente. No se usa usa inyectable porque los controladores no son servicios que se inyectan, sino que manejan las rutas y las solicitudes HTTP.

@Controller('health')
export class HealthController {}
