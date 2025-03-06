import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleFormComponent } from './example-form/example-form.component';
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
  declarations: [ExampleFormComponent]
})
export class ExampleManageModule { }
