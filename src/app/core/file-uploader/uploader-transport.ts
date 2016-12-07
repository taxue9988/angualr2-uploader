import { UploaderStack } from './uploader-stack';
import { UploaderFile } from './uploader-file';
import { UploaderQueue } from './uploader-queue';
import { WrapFile } from './wrap-file';
import { FileBlockInfoInterface, UploadOptionsInterface } from './interface';

import { Emitter } from './events';

export class UploaderTransport {

    private uploaderFile: UploaderFile;
    private queue: UploaderQueue;
    private options: UploadOptionsInterface;

    // 用于标记，上传是否运行中
    private running: boolean = false;

    // 上传缓存池，上传中或者等待上传的文件
    private pool: FileBlockInfoInterface[] = [];

    // 标记剩下的
    private remain: WrapFile[] = [];

    constructor(queue, options) {
        this.queue = queue;
        this.options = options;
        if (!this.options.transport.threads) {
            this.options.transport.threads = 3
        }
    }

    /**
     * start  开始上传
     */
    public start() {
        if (!this.queue.getQueueFiles() && !this.queue.getStats('queue')) {
            return false;
        }

        if (this.running) {
            this.run();
            return;
        }

        this.running = true;

        // 当pool中存在block时重新开始上传
        if (this.pool.length > 0) {
            let len = this.pool.length;
            for (let i = 0; i < len; i++) {
                this.pool[i].file.setStatus('progress', 'progress');
            }
        }


        this.run();
    }

    /**
     * stop 暂停上传，暂时不支持
     */
    public stop() {

    }

    /**
     * cancelFile    取消上传
     */
    public cancelFile(file: WrapFile) {
        if (!file.id) {
            return false;
        }

        if (file.blocks) {
            while (file.blocks.length) {
                file.blocks.shift();
            }
        }

        file.setStatus('deleted', 'deleted');
        Emitter.trigger('file_deleted', file);
    }

    // 开始运行
    private run() {
        let block: FileBlockInfoInterface;
        if (this.pool.length < this.options.transport.threads && (block = this.nextBlock())) {
            Emitter.trigger('file_transport', block);
            this.run();
        } else if (!this.remain.length && !this.queue.getStats('queue')) {
            Emitter.trigger('upload_finished');
        }
    }

    // 使用file_transport事件代替
    private send(block) {

    }

    /**
     * nextBlock    下一个分片
     */
    public nextBlock() {
        // 判断文件暂存区是否有文件,不存在则调用nextFile进行处理

        let block = this.getBlockFromPool();
        if (block) {
            return block.shift();
        } else if (this.running) {

            if (!this.remain.length && this.queue.getStats('queue')) {
                this.nextFile();
            }

            let nextFile = this.remain.shift();
            if (!nextFile) {
                return null;
            }

            let chunkSize = this.options.chunk.chunked ? this.options.chunk.chunkSize : 0;

            block = this.cuteFile(nextFile, chunkSize);
            this.pool.push(block);

            return block.shift();
        }

    }

    /**
     * popBlock
     */
    // public popBlock(block) {

    // }

    /**
     * getBlockFromPool    从缓存池中获取block;
     */
    public getBlockFromPool() {
        let i = 0,
            block;
        while ((block = this.pool[i++])) {
            if (block.has() && block.file.getStatus() === 'progress') {
                return block;
            } else if (!block.has() || block.file.getStatus() !== 'progress' && block.file.getStatus() !== 'interrupt') {
                this.pool.splice(--i, 1);
            }
        }

        return null;
    }

    /**
     * nextFile 准备下一个文件
     */
    public nextFile() {
        // 从队列中获取文件
        let file = (this.queue.fetch());
        let fileStatus = file.getStatus();

        if (fileStatus !== 'queued' && fileStatus !== 'invalid') {
            this.nextFile();
        }

        // 设置文件状态
        file.setStatus('progress', 'progress');

        // 把文件加入暂存区
        this.remain.push(file);
    }

    /**
     * cuteFile    文件切片处理
     */
    public cuteFile(file: WrapFile, chunkSize) {
        let self = this;
        let pool = [];
        let total = file.size,
            start = 0,
            chunks = chunkSize ? Math.ceil(total / chunkSize) : 1,
            chunk = 0,
            index = 0,
            len;

        let method = {
            file: file,
            has: function () {
                return !!pool.length;
            },
            shift: function () {
                return pool.shift();
            },
            unshift: function (block) {
                pool.unshift(block);
            }
        };

        while (index < chunks) {
            len = Math.min(chunkSize, total - start);

            let data: FileBlockInfoInterface = {
                file: file,
                total: total,
                start: start,
                end: chunkSize ? (start + len) : total,
                chunks: chunks,
                chunk: index++,
                cuted: method
            };

            pool.push(data);
            start += len;
        }

        file.blocks = pool.concat();
        file.remaning = pool.length;

        return method;

    }



}