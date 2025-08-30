import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: "homeManage",
        loadChildren: () => import("./home-manage/home-manage.module").then(m => m.HomeManageModule),
        data: {
          breadcrumb: '首页配置'
        }
      },
    ]
  },
];

export const PagesRoutes = RouterModule.forChild(routes);
