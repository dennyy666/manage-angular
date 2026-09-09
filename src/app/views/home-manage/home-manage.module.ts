import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroManageComponent } from './hero-manage/hero-manage.component';
import { HomeManageRoutes } from './home-manage.routing';
import { ZorroModule } from 'src/app/zorro/zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WarriorManageComponent } from './warrior-manage/warrior-manage.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    HomeManageRoutes,
    ZorroModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,    
  ],
  declarations: [HeroManageComponent,WarriorManageComponent]
})
export class HomeManageModule { }
