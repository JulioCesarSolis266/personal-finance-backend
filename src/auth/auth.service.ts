import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTRO
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id, // UUID REAL de la BD
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
