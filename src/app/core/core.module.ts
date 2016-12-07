import { NgModule, Optional, SkipSelf } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';


@NgModule({
    imports: [
        CommonModule,
        HttpModule,
    ],
    exports: [
        NetworkModule,
    ],
    declarations: [],
    providers: [
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}