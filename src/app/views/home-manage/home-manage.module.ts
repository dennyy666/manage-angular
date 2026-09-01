import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroManageComponent } from './hero-manage/hero-manage.component';
import { HomeManageRoutes } from './home-manage.routing';
import { ZorroModule } from 'src/app/zorro/zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    HomeManageRoutes,
    ZorroModule,
    FormsModule,
    ReactiveFormsModule,    
  ],
  declarations: [HeroManageComponent]
})
export class HomeManageModule { }
