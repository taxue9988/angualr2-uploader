import { NgModule } from '@angular/core';

// 加载路由
import { TestRouting } from './test.routing';

import { TestComponent } from './test.component';

import { SharedModule } from 'app/shared';


@NgModule({
    imports: [
        SharedModule,
        TestRouting,
    ],
    declarations: [
        TestComponent
    ],
    providers: [],
})

export class TestModule { }