import { UploadOptionsInterface } from './interface';
import { Emitter } from './events';
import { WrapFile } from './wrap-file';
import { System } from 'app/core/common';
import { CompressImg } from './image/processimg';

export class UploaderQueue {

    // 文件队列，未上传的文件
    private queueList: WrapFile[] = [];

    // 文件map，用于后面文件操作 键为file id,所有文件
    private fileMap: {} = {};

    // 存放预览文件
    private previewList: {} = {};

    // 配置
    private options: UploadOptionsInterface;

    // 控件name
    private name: string = '';

    // 所要替换的文件，不为空时选择的文件将用于替换它
    private _replace: WrapFile;

    public set replace(file: WrapFile) {
        this._replace = file;
    }


    // 文件状态统计
    private _stats = {
        queue: 0,
        success: 0,
        cancel: 0,
        progress: 0,
        uploadFaild: 0,
        invalid: 0,
        deleted: 0,
        interrupt: 0,
    };

    private fileStatus = {
        inited: 'inited',    //初始状态
        queued: 'queued',    //加入队列
        progress: 'progress',    //上传中，进度
        error: 'error',    // 错误
        success: 'success',    // 上传完成
        cancelled: 'cancelled',    // 取消
        interrupt: 'interrupt',    // 中断
        invalid: 'invalid',    // 文件验证失败
        deleted: 'deleted', // 文件被删除
    };

    // 文件后缀正则
    private regExt = /\.\w+$/;

    //允许上传文件的accept
    private acceptable: string;

    constructor(options: UploadOptionsInterface) {
        this.options = options;
        this.acceptable = this.options.accept.mimeTypes;
    }

    /**
     * getQueueList 获取队列内的文件
     */
    public getQueueFiles(): WrapFile[] {
        return this.queueList;
    }

    // 获取stats
    public getStats(key?: string): any {
        return key === undefined ? this._stats : this._stats[key];
    }

    /**
     * 批量添加文件，接收一个FileList
     * @controlName string 控件名称
     * @fileList FileList
     */
    addFiles(controlName: string, fileList: FileList) {
        if (fileList.length == 0) return;

        this.name = controlName;

        if (this._replace) {
            let l = fileList.length,
                f = fileList[l - 1];
            this.replaceFile(f);
            return;
        }

        for (let index = 0; index < fileList.length; index++) {
            let file = this.addFile(fileList.item(index));
            // this.queueList.push(file);
        }

        // 把文件传给 after_queued ，自动上传通过注册after_queued
        if (fileList.length) {
            Emitter.trigger('after_queued', fileList);
        }

    }

    /**
     * 添加文件
     * @source File 文件对象
     */
    private addFile(source: File): any {
        // 对文件进行封装
        let file = new WrapFile(source);
        // 设置控件名称
        if (this.name) {
            file.controlName = this.name;
        }

        // 执行 before_file_queued 事件
        Emitter.trigger('before_file_queued', file);

        if (file.getStatus() !== 'inited') {
            return false;
        }

        file.setStatus('file_loading', '文件加载中');

        if (file.status === 'error') {
            return false;
        }

        // 验证文件类型是否允许
        if (!this.isAcceptable(file)) {
            Emitter.trigger('error', 'file_type_denied', file);
            return;
        }

        this.append(file);

        // 图片预览
        if (~file.type.indexOf('image')) {
            let compressImg = new CompressImg(file.getSource(), this.options.preview.width, (imgURI) => {
                file.preViewImg = imgURI.src;
            });
        }

        Emitter.trigger('after_file_queued', file);

        return file;
    }

    /**
     * replaceFile
     */
    public replaceFile(source: File): boolean | WrapFile {
        let file = new WrapFile(source);


        // 设置控件名称
        if (this.name) {
            file.controlName = this.name;
        }
        let e;
        // 执行 before_file_queued 事件
        Emitter.trigger('before_file_queued', file);

        file.setStatus('file_loading', '文件加载中');

        if (file.status === 'error') {
            return false;
        }

        // 验证文件类型是否允许
        if (!this.isAcceptable(file)) {
            Emitter.trigger('error', 'file_type_denied', file);
            return;
        }


        // 图片预览
        if (~file.type.indexOf('image')) {
            let compressImg = new CompressImg(file.getSource(), 100, (imgURI) => {
                file.preViewImg = imgURI.src;
            });
        }

        // for (let i = 0; i < this.queueList.length; i++) {
        //     if (this.queueList[i].id === this._replace.id) {
        //         this.queueList[i] = file;
        //     }
        // }

        // 文件替换

        let qindex = this.queueList.indexOf(this._replace);
        this.queueList[qindex] = file;

        this.fileMap[this._replace.id] = file;

        let index = this.previewList[file.controlName].indexOf(this._replace);
        this.previewList[file.controlName][index] = file;

        Emitter.trigger('after_file_queued', file);
        this._replace = null;

        return file;
    }

    /**
     * 判断accept
     */
    private isAcceptable(file: WrapFile) {
        var invalid = !file || !file.size || this.acceptable &&
            this.regExt.exec(file.name) && !(this.acceptable.indexOf(file.type) != -1);

        return !invalid;
    }
    /**
     * 把文件加到队列尾部
     */
    append(file: WrapFile) {
        this.queueList.push(file);
        this.addFileMap(file);
        // 把文件加入预览列表
        this.addFileToPreviewList(this.name, file);
    }

    /**
     * 把文件加到队列头部
     */
    prepend(file: WrapFile) {
        this.queueList.unshift(file);
        this.addFileMap(file);
    }

    /**
     * 把文件加到file map中
     */
    private addFileMap(file: WrapFile) {
        if (System.isEmptyObject(this.fileMap)) {
            // 文件状态发生变化时触发
            // @cur string 当前状态
            // @pre string 上一个状态
            Emitter.register('file_status_change', (cur: string, pre: string) => {
                this.fileStatusChange(cur, pre);
            }, this);
        }

        this.fileMap[file.id] = file;
        file.setStatus(this.fileStatus.queued, 'queued');
    }

    private addFileToPreviewList(controlName: string, file: WrapFile) {
        if (!this.previewList[controlName]) {
            this.previewList[controlName] = []
        }

        this.previewList[controlName].push(file);
    }

    /**
     * 根据文件状态修改队列统计
     */
    private fileStatusChange(curStatus: string, preStatus: string) {

        switch (preStatus) {
            case this.fileStatus.progress:
                this._stats.progress--;
                break;
            case this.fileStatus.queued:
                this._stats.queue--;
                break;
            case this.fileStatus.error:
                this._stats.uploadFaild--;
                break;
            case this.fileStatus.invalid:
                this._stats.invalid--;
                break;
            case this.fileStatus.interrupt:
                this._stats.interrupt--;
                break;
        }

        switch (curStatus) {
            case this.fileStatus.queued:
                this._stats.queue++;
                break;
            case this.fileStatus.progress:
                this._stats.progress++;
                break;
            case this.fileStatus.error:
                this._stats.uploadFaild++;
                break;
            case this.fileStatus.success:
                this._stats.success++;
                break;
            case this.fileStatus.cancelled:
                this._stats.cancel++;
                break;
            case this.fileStatus.interrupt:
                this._stats.interrupt++;
                break;
            case this.fileStatus.invalid:
                this._stats.invalid++;
                break;
        }

    }

    /**
     * 根据id获取文件
     * @id string 文件id
     */
    getFile(id: string) {
        if (typeof id !== 'string') return id;

        return this.fileMap[id];
    }

    /**
     * getFiles 获取所有添加成功的文件
     */
    public getFiles() {
        return this.fileMap;
    }

    /**
     * 根据input的name获取预览的图片列表
     * getPreviewFiles
     * @controlName string input name
     */
    public getPreviewFiles(controlName?: string) {
        if (controlName === undefined) {
            controlName = 'default';
        }

        return this.previewList[controlName];
    }

    /**
     * 获取所有上传成功的预览数据
     * getAllPreviewFiles
     */
    public getAllPreviewFiles() {
        return this.previewList;
    }

    /**
     * fetch
     */
    public fetch(status?: string) {
        status = status === undefined ? 'queued' : status;
        let i = 0, file: WrapFile;

        while ((file = this.queueList[i++])) {
            if (file.getStatus() === status) {
                return file;
            }
        }

    }

    /**
     * removeFile    删除文件
     * @file WrapFile 文件对象
     */
    public removeFile(file: WrapFile) {
        if (this.fileMap[file.id]) {
            delete this.fileMap[file.id];
            file.setStatus(this.fileStatus.deleted, 'deleted');
        }
        let qindex = this.queueList.indexOf(file);
        this.queueList.splice(qindex, 1);

        if (this.previewList[file.controlName]) {
            let i = this.previewList[file.controlName].indexOf(file);
            this.previewList[file.controlName].splice(i, 1);
        }
    }

    /**
     * sort    对队列进行排序
     */
    public sort(fn) {
        if (typeof fn === 'function') {
            this.queueList.sort(fn);
        }
    }

    /**
     * rest    重置队列
     */
    public rest() {
        this.fileMap = {};
        this.queueList = [];
        Emitter.trigger('uploader_rest');
    }
}