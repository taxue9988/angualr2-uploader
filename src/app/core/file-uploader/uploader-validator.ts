import { UploaderFile } from './uploader-file';
import { Emitter } from './events';
export class UploaderValidator {
    // 验证器注册表
    private static validators = {};
    /**
     * init 验证初始化
     */
    public static init() {
        let self = UploaderValidator;
        self.fileNumLimit();
        self.fileSizeLimit();
        self.fileSingleSizeLimit();
        self.fileDuplicate();

        for (let item in UploaderValidator.validators) {
            (UploaderValidator.validators[item])();
        }

    }

    /**
     * addValidator   添加验证器
     */
    public static addValidator(vname: string, fn: Function) {
        UploaderValidator.validators[vname] = fn;
    }

    /**
     * removeValidator    删除验证器
     */
    public static removeValidator(vname: string) {
        delete UploaderValidator.validators[vname];
    }

    //验证文件总数量
    private static fileNumLimit() {
        UploaderValidator.addValidator('fileNumLimit', function () {
            let count: number = 0,
                options = UploaderFile.options,
                max = options.file.fileNumLimit;


            if (!max) return;

            Emitter.register('before_file_queued', function (file) {
                if (count > max) {
                    Emitter.trigger('error', 'queue_exceed_num_limit', max, file);
                    return false;
                }
                return true;
            }, this);

            Emitter.register('after_file_queued', function (file) {
                count++;
            }, this);

            Emitter.register('file_removed', function (file) {
                count--;
            }, this);

            Emitter.register('uploader_rest', function () {
                count = 0;
            }, this);

        });
    }

    // 验证文件总大小
    private static fileSizeLimit() {
        UploaderValidator.addValidator('fileSizeLimit', function () {
            let options = UploaderFile.options,
                count = 0,
                max = <number>options.file.fileSizeLimit >> 0;

            if (!max) return true;

            Emitter.register('before_file_queued', function (file) {
                let size = count + file.size;
                if (size > max) {
                    Emitter.trigger('error', 'queue_exceed_size_limit', max, file);
                    return false;
                }
                return true;
            }, this);

            Emitter.register('after_file_queued', function (file) {
                count += file.size;
            }, this);

            Emitter.register('file_removed', function (file) {
                count -= file.size;
            }, this);

            Emitter.register('uploader_rest', function () {
                count = 0;
            }, this);

        });
    }

    private static fileSingleSizeLimit() {
        UploaderValidator.addValidator('fileSingleSizeLimit', function () {
            let options = UploaderFile.options,
                fileSize = <number>options.file.fileSingleSizeLimit >> 0;

            if (!fileSize) return;

            Emitter.register('before_file_queued', function (file) {
                if (fileSize < file.size) {
                    file.setStatus('error', 'file_exceed_size');
                    Emitter.trigger('error', 'file_exceed_size', fileSize, file);
                    return false;
                }
                return true;
            }, this);

        });
    }

    private static fileDuplicate() {
        UploaderValidator.addValidator('fileDuplicate', function () {
            let filesHashMap = {},
                fileHash;
            Emitter.register('before_file_queued', function (file) {
                fileHash = file.$hash || UploaderValidator.fileHash(file);
                if (filesHashMap[fileHash]) {
                    file.setStatus('error', 'file_duplicate');
                    Emitter.trigger('error', 'file_duplicate', file);
                    return false;
                }

                filesHashMap[fileHash] = true;
                return true;
            }, this);

            Emitter.register('after_file_queued', function (file) {
                file.$hash && (filesHashMap[file.$hash] = true);
            }, this);

            Emitter.register('file_removed', function (file) {
                file.$hash && (delete filesHashMap[file.$hash]);
            }, this);

            Emitter.register('uploader_rest', function () {
                filesHashMap = {};
            }, this);
        });
    }

    private static fileHash(file) {
        let str = file.name + file.size + file.lastModifiedDate,
            len = str.length,
            char,
            hash = 0;
        for (let i = 0; i < len; i++) {
            char = str.charCodeAt(i);
            hash = char + (hash << 5) + (hash << 5) - hash;
        }
        return hash;
    }

}