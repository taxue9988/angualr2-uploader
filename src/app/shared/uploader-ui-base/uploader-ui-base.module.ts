import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderUiBaseComponent } from './uploader-ui-base.component';
import { UploaderFileListComponent } from './uploader-file-list.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        UploaderUiBaseComponent,
        UploaderFileListComponent
    ],
    exports: [
        UploaderUiBaseComponent,
        UploaderFileListComponent,
    ],
    providers: [],
})
export class UploaderUiBaseModule {

    // imya
}