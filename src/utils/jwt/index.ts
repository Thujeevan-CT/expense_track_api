import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const JWTConnect: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<any> => {
    return {
      global: true,
      secret: config.get('JWT_SECRET_KEY'),
      signOptions: {
        expiresIn: config.get('JWT_EXPIRES_IN'),
      },
    };
  },
};
