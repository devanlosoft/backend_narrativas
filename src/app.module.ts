import { CategoriesModule } from './modules/narrativas/narrativas.module';
import { UsersModule } from './modules/users/users.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

@Module({
  imports: [
    CategoriesModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*'); // Reemplaza esto con el origen de tu aplicación React
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, PUT, DELETE, OPTIONS',
        );
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept',
        );
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
      })
      .forRoutes('*');
  }
}
