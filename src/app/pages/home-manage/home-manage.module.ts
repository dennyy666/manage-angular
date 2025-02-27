import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeManageRoutes } from './home-manage.routing';
import { AntduiModule } from '../../antdui/antdui.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HeroManageComponent } from './hero-manage/hero-manage.component';
@NgModule({
  imports: [
    CommonModule,
    HomeManageRoutes,
    AntduiModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [HeroManageComponent]
})
export class HomeManageModule { }
