import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { AntduiModule } from './antdui/antdui.module';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './PageNotFound/PageNotFound.component';

registerLocaleData(zh);

@NgModule({
  declarations: [			
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AntduiModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
