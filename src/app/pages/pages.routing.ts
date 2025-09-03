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
      {
        path: "exampleManage",
        loadChildren: () => import("./example-manage/example-manage.module").then(m => m.ExampleManageModule),
        data: {
          breadcrumb: '示例页栏目'
        }
      },      
    ]
  },
];

export const PagesRoutes = RouterModule.forChild(routes);
