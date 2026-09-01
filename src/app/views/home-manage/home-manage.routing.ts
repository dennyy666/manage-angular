import { Routes, RouterModule } from '@angular/router';
import { HeroManageComponent } from './hero-manage/hero-manage.component';

const routes: Routes = [
  { 
    path: 'heroManage', 
    component: HeroManageComponent,
    data: {
      breadcrumb: '英雄管理'
    }
  }
];

export const HomeManageRoutes = RouterModule.forChild(routes);
