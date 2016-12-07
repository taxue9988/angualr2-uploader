import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
    selector: 'uploader-file-list',
    templateUrl: './uploader-file-list.component.html',
})
export class UploaderFileListComponent {
    // 预览列表
    @Input('file-list') public fileList;

    // 控件名称
    @Input('control-name') public controlName;

    // 用于触发文件选择事件
    @Output('reselect') select: EventEmitter<any> = new EventEmitter();

    /**
     * 预览点击事件
     * @file 文件对象<WrapFile>,用于后续的文件替换
     */
    onClick(file) {
        if (!this.controlName) {
            this.controlName = 'default';
        }
        this.select.emit({
            controlName: this.controlName,
            file: file
        });
    }

}