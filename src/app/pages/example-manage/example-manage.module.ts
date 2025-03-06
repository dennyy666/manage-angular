import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AntduiModule } from '../../antdui/antdui.module';
import { ExampleManageRoutes } from './example-manage.routing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    AntduiModule,
    ExampleManageRoutes,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class ExampleManageModule { }
