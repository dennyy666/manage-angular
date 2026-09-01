import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: "homeManage",
        loadChildren: () => import("../views/home-manage/home-manage.module").then(m => m.HomeManageModule),
        data: {
          breadcrumb: '首页配置'
        }
      },
    ]     
  },
];

export const LayoutRoutes = RouterModule.forChild(routes);
