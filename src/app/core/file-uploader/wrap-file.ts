import { System } from 'app/core';
import { Emitter } from './events';
export class WrapFile {
    /**
     *文件名称
     */
    name: string;
    /**
     *文件大小
     */
    size: number;
    /**
     *文件mimeType类型
     */
    type: string;
    /**
     *文件最后修改的时间
     */
    lastModifiedDate: Date;
    /**
     *文件id，唯一
     */
    id: string;
    /**
     *文件扩展名
     */
    ext: string;

    /**
     *存放文件block
     */
    blocks: any;
    /**
     * 剩余的block数量
     */
    remaning: number;
    /**
     * 上传控件名称
     */
    controlName: string = '';

    /**
     *状态说明文字
     */
    private _statusText: string;
    /**
     *文件状态
     */
    private _status: string;
    /**
     *原始文件
     */
    private _source: File;

    /**
     * 加载进度
     */
    private _loadProgress: any;

    // 预览图片
    public preViewImg;

    // 文件hash值
    private _hash: string;

    constructor(file: File) {
        this.name = file.name || 'untitled';
        this.size = file.size || 0;
        this.type = file.type || 'application/octet-stream';
        // this.lastModifiedDate = file.lastModifiedDate || (<any>(new Date()) * 1);
        this.id = System.guid();
        this.ext = this.getExt();
        this.setStatus('inited', '');
        this.source = file;
    }

    // 状态
    public getStatus(): string {
        return this._status;
    }

    public set status(status: string) {
        let prevStatus = this.status;

        if (status !== prevStatus) {
            this._status = status;
        }
    }

    // 文件hash值
    public get hash(): string {
        return this._hash;
    }
    public set hash(v: string) {
        this._hash = v;
    }

    // 状态信息
    public get statusText(): string {
        return this._statusText;
    }

    /**
     * setLoadProgress 设置加载进度
     */
    public setLoadProgress(progress: number) {
        this._loadProgress = progress;
    }

    /**
     * getLoadProgress 获取加载进度
     */
    public getLoadProgress() {
        return this._loadProgress;
    }

    /**
     * setStatus    设置文件状态信息
     */
    public setStatus(status: string, text: string) {
        let pre = this._status;
        this._status = status;
        this._statusText = text;
        Emitter.trigger('file_status_change', status, pre);
    }

    // 设置源文件
    public get source(): File {
        return this._source;
    }
    public set source(file: File) {
        this._source = file;
    }

    /**
     * slice 切片
     */
    public slice(start: number, end: number): Blob {
        return this.source.slice(start, end);
    }

    /**
     * 获取文件的后缀(扩展名)
     */
    getExt() {
        let regExt = /\.([^.]+)$/;
        return regExt.exec(this.name) ? RegExp.$1 : '';
    }

    /**
     * destroy    设置文件状态为空，在上传时过滤掉相当于删除了该文件
     */
    public destroy() {
        this._status = '';
    }

    /**
     * getSource 获取文件原始数据,未经过封装
     */
    public getSource() {
        return this._source;
    }
}

