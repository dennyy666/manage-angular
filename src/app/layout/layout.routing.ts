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
      {
        path: "exampleManage",
        loadChildren: () => import("../views/example-manage/example-manage.module").then(m => m.ExampleManageModule),
        data: {
          breadcrumb: '示例页栏目'
        }
      }, 
    ]     
  },
];

export const LayoutRoutes = RouterModule.forChild(routes);
