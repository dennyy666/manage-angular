import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutRoutes } from './layout.routing';
import { RouterModule } from '@angular/router';
import { ZorroModule } from '../zorro/zorro.module';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { SlideBarComponent } from './components/slide-bar/slide-bar.component';
import { TagsViewComponent } from './components/tags-view/tags-view.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutes,
    RouterModule,
    ZorroModule
  ],
  declarations: [
    LayoutComponent,
    BreadCrumbComponent,
    SlideBarComponent,
    TagsViewComponent,
  ]
})
export class LayoutModule { }
