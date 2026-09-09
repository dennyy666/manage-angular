import { Routes, RouterModule } from '@angular/router';
import { HeroManageComponent } from './hero-manage/hero-manage.component';
import { WarriorManageComponent } from './warrior-manage/warrior-manage.component';

const routes: Routes = [
  {
    path: 'heroManage',
    component: HeroManageComponent,
    data: {
      breadcrumb: '英雄管理'
    }
  },
  {
    path: 'warriorManage',
    component: WarriorManageComponent,
    data: {
      breadcrumb: '英雄管理'
    }
  }
];

export const HomeManageRoutes = RouterModule.forChild(routes);
