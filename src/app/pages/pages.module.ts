import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { PagesRoutes } from './pages.routing';
import { AntduiModule } from '../antdui/antdui.module';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    PagesRoutes,
    AntduiModule,
    RouterModule
  ],
  declarations: [PagesComponent]
})
export class PagesModule { }
