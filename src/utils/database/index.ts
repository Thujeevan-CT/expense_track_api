import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

const ConnectMongoDB: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    config: ConfigService,
  ): Promise<MongooseModuleOptions> => ({
    uri: config.get('DATABASE_URI'),
  }),
  inject: [ConfigService],
};

export default ConnectMongoDB;
