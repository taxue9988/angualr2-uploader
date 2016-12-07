import { EventEmitter, ElementRef } from '@angular/core';

export abstract class UploadFileComponent {
    // 是否允许同时选择多个文件，默认允许
    multiple: boolean = true;

    // 设置允许上传的类型，默认为所有图片
    accept: string = 'image/*';

    // 设置上传控件的name，当一个表单中有多个上传按钮或者上传区域时用于区分文件来自哪里
    controlName: string = '';

    inputClass: string = '';

    // 当有文件上传时触发
    fileChanged: EventEmitter<any> = new EventEmitter();

    inputFile: ElementRef;

    // 当input选择文件后触发
    onChange($event) {
        this.fileChanged.emit({
            controlName: this.controlName || 'defaule',
            event: $event,
            inputFile: this.inputFile
        });
    }


}