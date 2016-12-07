import { Routes, RouterModule } from '@angular/router';

export const AppRoutes:Routes = [
    { path: 'test', loadChildren: 'app/modules/test/test.module#TestModule' },
    { path: '', redirectTo: '/test', pathMatch: 'full', },
];

export const AppRouting = RouterModule.forRoot(AppRoutes);
