import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestComponent } from './test.component';

const TestRoutes: Routes = [
    {
        path: '',
        component: TestComponent,
    }
];

export const TestRouting: ModuleWithProviders = RouterModule.forChild(TestRoutes);