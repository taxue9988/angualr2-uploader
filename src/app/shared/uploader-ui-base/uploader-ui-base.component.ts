import { Component, EventEmitter, Input, Output, OnChanges, Renderer, ViewChild, ElementRef } from '@angular/core';
import { UploadFileComponent } from 'app/core/file-uploader';

@Component({
    selector: 'uploader-ui-base',
    templateUrl: './uploader-ui-base.component.html',
    inputs: ['title']
})
export class UploaderUiBaseComponent extends UploadFileComponent {

    // 是否允许同时选择多个文件，默认允许
    @Input() multiple: boolean = true;
    @Input('file-list') fileList;

    // 设置允许上传的类型，默认为所有图片
    @Input() accept: string = 'image/*';

    // 设置上传控件的name，当一个表单中有多个上传按钮或者上传区域时用于区分文件来自哪里
    @Input() controlName: string = '';

    // 设置input file的class name
    @Input('inputClass') inputClass: string = '';


    // 当有文件上传时触发
    @Output('changed') fileChanged: EventEmitter<any> = new EventEmitter();

    // 模板引用变量，input上传控件
    @ViewChild('inputFile') inputFile: ElementRef;


    public title: string;


    constructor(
        private renderer: Renderer
    ) {
        super();
    }

    // 当预览列表是子元素时点击可打开文件选择
    reselect($event) {
        if (this.inputFile.nativeElement.name !== this.controlName) {
            return;
        }
        this.inputFile.nativeElement.click();
    }
}