import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
  },
];

export const PagesRoutes = RouterModule.forChild(routes);
