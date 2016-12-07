import { System } from 'app/core';

import { EventEmitter } from '@angular/core';
import { Emitter } from './events';

import { UploaderQueue } from './uploader-queue';
import { UploadOptionsInterface } from './interface';
import { UploaderFileType } from './uploader-file-type';
import { UploaderValidator } from './uploader-validator';
import { UploaderTransport } from './uploader-transport';

export class UploaderFile {

    // static options: UploadOptionsInterface;

    private static _options: UploadOptionsInterface;

    // 控件名称 暂时不使用
    // private controlName: string = '';

    // 验证器
    private validator: UploaderValidator;

    // 队列
    public queue: UploaderQueue; //文件队列

    // 传输
    private transport: UploaderTransport;

    constructor(options: UploadOptionsInterface) {

        // accept处理
        if (options.accept !== undefined) {
            let fileType = new UploaderFileType();
            options.accept.mimeTypes = fileType.getAccepts(options.accept.extensions);
        }

        // 未设置文件配置时设置默认值
        if (options.file === undefined) {
            options.file = {
                fileNumLimit: 0,
                fileSizeLimit: 0,
                fileSingleSizeLimit: 0
            }
        }

        // 初始化配置信息
        UploaderFile.options = options;
        // 初始化队列
        this.queue = new UploaderQueue(options);
        // 初始化传输
        this.transport = new UploaderTransport(this.queue, this.getOptions());
        // 验证器初始化
        UploaderValidator.init();


        // 初始化验证器

        // Emitter.register('after_queued', (files) => {
        //     this.transport.start();
        // }, this);


    }

    public static get options(): UploadOptionsInterface {
        return this._options;
    }
    public static set options(v: UploadOptionsInterface) {
        this._options = v;
    }

    /**
     *获取配置信息
     */
    getOptions() {
        return UploaderFile.options;
    }

    /**
     * 当文件上传控件发生改变，即有文件上传时触发
     */
    controlOnChange(info: any) {
        // this.setControlName(info.controlName);
        this.addFiles(info.controlName, this.getFileList(info.event));
    }

    /**
     * 设置上传控件名称，同时存在多个上传时用来区分文件来自哪里
     * 暂时不使用
     */
    // setControlName(name: string) {
    //     if (name !== undefined || name !== 'default' || name !== '') {
    //         this.controlName = name;
    //     }
    // }

    /**
     * 从传递的事件信息中获取文件
     */
    getFileList(event: any) {
        return event.target.files;
    }

    /**
     * getFiles 获取文件信息
     */
    public getFiles() {
        // return this.queue.getFiles();
    }

    /**
     * 添加文件到队列中
     * @event EventEmitter 当上传控件发生变化时传递的事件
     */
    addFiles(controlName: string, fileList: FileList) {
        this.queue.addFiles(controlName, fileList);
    }

    /**
     * setReplace
     */
    public setReplace(file) {
        this.queue.replace = file;
    }

    /**
     * UploaderInit
     */
    public uploaderInit() {

    }

    /**
     * error 错误处理事件
     */
    public error(fn: Function) {
        Emitter.register('error', fn, this);
    }

    /**
     * beforeFileQueued 事件，该事件在单个文件加入队列前执行,回调参数为file:WrapFile
     */
    public beforeFileQueued(fn: Function) {
        Emitter.register('before_file_queued', fn, this);
    }

    /**
     * afterQueued 添加事件，该事件在所有文件加入队列后执行，回调参数为files(所有成功加入队列的文件)
     */
    public afterQueued(fn: Function) {
        Emitter.register('after_queued', fn, this);
    }

    /**
     * afterFileQueued 每个文件成功加入队列后执行
     */
    public afterFileQueued(fn: Function) {
        Emitter.register('after_file_queued', fn, this);
    }

    /**
     * fileTransport 注册传输事件,每个文件开始传输事调用的方法，一般为http处理
     */
    public fileTransport(fn: Function) {
        Emitter.register('file_transport', fn, this);
    }

    /**
     * fileDuplicate
     */
    public file_duplicate(fn: Function) {
        Emitter.register('before_file_queued', fn, this);
    }

    /**
     * transport  开始上传
     */
    public startUpload() {
        this.transport.start();
    }


}