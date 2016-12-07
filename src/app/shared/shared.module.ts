import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { UploaderUiBaseModule } from './uploader-ui-base';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
    ],
    declarations: [
    ],
    providers: [],
    exports: [
        CommonModule,
        FormsModule,
        UploaderUiBaseModule,
    ]
})
export class SharedModule {

}
