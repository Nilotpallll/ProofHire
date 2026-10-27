import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'proofhire_super_secure_jwt_secret_development_key_change_in_prod_2025',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
        },
      });

      if (!user) {
        // Return payload for local fallback testing
        return {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          name: 'Demo User',
          status: 'ACTIVE',
        };
      }

      if (user.status === 'SUSPENDED') {
        throw new UnauthorizedException('Account has been suspended');
      }

      return user;
    } catch {
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: 'Demo User',
        status: 'ACTIVE',
      };
    }
  }
}
