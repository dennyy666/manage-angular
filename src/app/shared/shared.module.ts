import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZorroModule } from '../zorro/zorro.module';
import { TableComponent } from './components/table/table.component';

@NgModule({
  imports: [
    CommonModule,
    ZorroModule,
  ],
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent
  ]
})
export class SharedModule { }
