import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
// import { ConnectionOptions } from 'typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TodoModule } from './todo/todo.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { CoreModule } from './core/core.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  /**/
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front'),
    }),
    TodoModule,
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    CoreModule,
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // static forRoot(connOpt: ConnectionOptions): DynamicModule {
  //   console.log('connOpt', connOpt)
  //   return {
  //     module: AppModule,
  //     controllers: [AppController],
  //     imports: [TodoModule, TypeOrmModule.forRoot(connOpt)],
  //     providers: [AppService],
  //   }
  // }
}
