import { Component, OnInit } from '@angular/core';
import { UploaderService} from 'app/core/file-uploader';

/** 上传测试start */
import { UploaderFile, TransportOptionsInterface, UploadOptionsInterface } from 'app/core/file-uploader';

import { ImageHandler } from 'app/core/file-uploader/image';

import { Md5File } from 'app/core/file-uploader';

import { Md5 } from 'app/core/file-uploader/hash/md5';

@Component({
    templateUrl: './test.component.html',
    styleUrls: []
})
export class TestComponent {
    private uploaderFile: UploaderFile;

    // 上传控件名称，即input的name
    controlName: string = 'default_upload';
    avatarFile: string = 'avatar';
    replace_pic: string = 'replace_pic';

    // 上传配置
    options: UploadOptionsInterface = {
        pick: {
            multiple: true,
        },
        accept: {
            title: 'app',
            // 文件扩展名，程序自动获取mimetype
            extensions: 'jpg,png,gif,zip,rar,tar,gz',
            mimeTypes: ''
        },
        transport: {
            server: 'http://baidu.com',
            threads: 3
        },
        file: {
            // fileNumLimit:0,
            // fileSingleSizeLimit: 50
        },
        compress: {
            width: 1000,
            height: 1000,
            quality: 80,
            allowMagnify: false,
            crop: true,
            preserveHeaders: true,
            noCompressIfLarger: true,
            compressSize: 0
        },
        chunk: {
            chunked: true,
            chunkSize: 20 * 1024,
            chunkRetry: 3,
        }，
        preview: {
            width: 100
        }
    };

    // input的class值
    class: string = 'uploader-element-invisible';
    // 是否允许多选
    multiple: boolean = true;

    accept: string = this.options.accept.mimeTypes;

    // 同一个页面有多个上传区域时，用于存放input对象(仅预览和上传为兄弟元素<平行>时使用)
    inputs: {} = {};

    // 预览文件(仅图片)
    private files;
    private avatar;
    private replacePic;


    constructor(
        private us:UploaderService,
    ) {

        // 创建uploader实例
        this.uploaderFile = new UploaderFile(this.options);

        // 注册beforeFileQueued事件，在单个文件加入队列前执行
        // 对单个文件的处理可以在这里进行，例如md5
        this.uploaderFile.beforeFileQueued(function (file) {
            console.log(file);
        });

        // 注册错误事件，所有错误都会触发
        this.uploaderFile.error((...args: any[]) => {
            console.log(args);
        });

        // 注册afterFileQueued事件，单个文件成功加入队列时执行
        // 对单个文件的处理可以在这里进行，例如md5
        this.uploaderFile.afterFileQueued((file) => {
            var md5File = new Md5File();
            md5File.loadFromBlob(file);
        });

        // 注册afterQueued事件，当选择的文件都加入队列后执行
        // 自动上传可以在这里配置
        this.uploaderFile.afterQueued((files) => {
            // 自动上传
            this.uploaderFile.startUpload();
            if (this.options.transport.auto) {
                this.uploaderFile.startUpload();
            }
            console.log(this.uploaderFile);
            // 获取文件状态
            // this.uploaderFile.queue.getStats();
        });

        // 注册传输,
        this.uploaderFile.fileTransport((block) => {
            // 文件相关信息都在这里
            console.log(block);

            // 分片使用block.file.source.slice(block.start,block.end);
            // 对分片求hash值可用Md5File,参照上面

            // 使用http发送数据
            // ng2 http ....
            // 上传需要用到formData,content-type必须是multipart/form-data，为什么？自行百度、谷歌(html multipart/form-data)

            let fd: FormData = new FormData();
            fd.append('name', block.file.source.slice(block.start,block.end));

            this.us.upload(fd)
                .subscribe(t => {
                    console.log(t);
                },
                e => {
                    console.log(e);
                });
        });
    }



    // 当有新文件添加时执行
    onChange(info) {
        console.log(info);
        this.uploaderFile.controlOnChange(info);

        if (!this.inputs[info.controlName]) {
            this.inputs[info.controlName] = info.inputFile;
        }

        let files = this.uploaderFile.queue.getPreviewFiles(info.controlName);

        switch (info.controlName) {
            case 'default_upload':
                this.files = files;
                break;
            case 'avatar':
                this.avatar = files;
                break;
            case 'replace_pic':
                this.replacePic = files;
                break;
        }
    }

    // 兄弟元素(预览列表)，点击预览可打开文件选择并替换，非内嵌
    reselect($event) {
        console.log($event);
        let input = this.inputs[$event.controlName];
        if (!input) {
            return;
        }
        this.uploaderFile.setReplace($event.file);

        input.nativeElement.click();
    }

    /** 文件上传测试end */

}
