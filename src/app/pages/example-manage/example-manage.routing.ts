import { Routes, RouterModule } from '@angular/router';
import { ExampleFormComponent } from './example-form/example-form.component';

const routes: Routes = [
  { 
    path: 'exampleForm', 
    component: ExampleFormComponent,
    data: {
      breadcrumb: '首页展示'
    }
   },
];

export const ExampleManageRoutes = RouterModule.forChild(routes);
