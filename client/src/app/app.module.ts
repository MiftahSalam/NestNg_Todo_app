import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MasterComponent } from './shared/master/master.component';
import { HomeComponent } from './shared/home/home.component';
import { AppCommonModule } from 'projects/app-common/src/public-api';
import { AuthModule } from 'projects/auth/src/public-api';
import { JwtInterceptorProvider } from 'projects/auth/src/lib/interceptors/jwt.interceptor';
import { ErrorInterceptorProvider } from 'projects/auth/src/lib/interceptors/error.interceptor';
import { TodoModule } from 'projects/todo/src/public-api';

@NgModule({
  declarations: [AppComponent, MasterComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppCommonModule,
    AuthModule,
    TodoModule,
  ],
  providers: [JwtInterceptorProvider, ErrorInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
