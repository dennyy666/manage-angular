import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleFormComponent } from './example-form/example-form.component';
import { AntduiModule } from '../../antdui/antdui.module';
import { ExampleManageRoutes } from './example-manage.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberDirective } from './example-form/input-number.directive';
import { DataConfigurationComponent } from './example-form/data-configuration/data-configuration.component';
import { AssayIndicatorComponent } from './example-form/assay-indicator/assay-indicator.component';
import { SectionConfigurationComponent } from './example-form/section-configuration/section-configuration.component';
import { OutStationSetComponent } from './example-form/out-station-set/out-station-set.component';

@NgModule({
  imports: [
    CommonModule,
    AntduiModule,
    ExampleManageRoutes,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ExampleFormComponent,
    InputNumberDirective,
    DataConfigurationComponent,
    AssayIndicatorComponent,
    SectionConfigurationComponent,
    OutStationSetComponent
  ]
})
export class ExampleManageModule { }
