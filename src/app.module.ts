import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.services';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { UserRepository } from './repositories/user.repositoty';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './middleware/exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/authGuard';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.createTypeOrmOptions()),
    TypeOrmModule.forFeature([User, Event]),
    JwtModule.register({
      global: true,
      secret: 'value',
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  controllers: [AppController, UserController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    AppService,
    UserService,
    UserRepository,
  ],
})
export class AppModule {}
