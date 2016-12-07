import { AArrayBuffer } from './array-buffer';
import { Emitter } from '../events';

export class Md5File {
    result: any;

    constructor() {

    }

    public loadFromBlob(file) {
        let wrapFile = file,
            blob = file.getSource(),
            chunkSize = 2 * 1024 * 1024,
            chunks = Math.ceil(blob.size / chunkSize),
            chunk = 0,
            // owner = this.owner,
            spark = new AArrayBuffer(),
            me = this,
            blobSlice = blob.mozSlice || blob.webkitSlice || blob.slice,
            loadNext, fr;

        fr = new FileReader();

        loadNext = function () {
            var start, end;
            start = chunk * chunkSize;
            end = Math.min(start + chunkSize, blob.size);

            fr.onload = function (e) {
                spark.append(e.target.result);
                // 设置文件加载进度
                wrapFile.setLoadProgress((chunk + 1) / chunks);
            };

            fr.onloadend = function () {
                fr.onloadend = fr.onload = null;

                if (++chunk < chunks) {
                    setTimeout(loadNext, 1);
                } else {
                    setTimeout(function () {
                        Emitter.trigger('md5_file_load', chunkSize, chunks, chunk);
                        me.result = spark.end();
                        loadNext = file = blob = spark = null;
                        // 设置文件hash值
                        wrapFile.hash = me.result;
                        Emitter.trigger('md5_file_complete', wrapFile);
                    }, 50);
                }
            };

            fr.readAsArrayBuffer(blobSlice.call(blob, start, end));
        };

        loadNext();
    }

    /**
     *  getResult
     */
    public getResult() {
        return this.result;
    }
}