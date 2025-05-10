import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroManageComponent } from './hero-manage/hero-manage.component';
import { HomeManageRoutes } from './home-manage.routing';
import { AntduiModule } from '../../antdui/antdui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
