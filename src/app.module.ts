import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/modules/user.module';
import { databaseConfig } from './config/database.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Obtener la URI del ConfigService pero usar las opciones de databaseConfig
        const uri = configService.get('MONGODB_URI');
        return {
          uri,
          ...databaseConfig.options,
        };
      },
    }),
    UsersModule,
  
  ],
})
export class AppModule {}
