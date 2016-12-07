declare var window: any;

import { AArrayBuffer } from '../hash';

interface urlApiInterface {
    createObjectURL;
    revokeObjectURL;
}

export class ImageUtil {
    private static urlApi: urlApiInterface = window.createObjectURL && window || window.URL && URL.revokeObjectURL && URL || window.webkitURL;

    /**
     * createObjectURL 创建一个domstring 生命周期和窗口中的文档有关
     * @blob  File|Blob file对象或者blob对象
     */
    public static createObjectURL(blob: Blob | File) {
        if (ImageUtil.urlApi && blob) {
            return ImageUtil.urlApi.createObjectURL(blob);
        }
    }

    /**
     * revokeObjectURL 清理内存
     * @objectURL string 需要释放的objecURL字符串
     */
    public revokeObjectURL(objectURL: string) {
        if (ImageUtil.urlApi && objectURL) {
            ImageUtil.urlApi.revokeObjectURL(objectURL);
        }
    }

    /**
     * dataURL2Blob 把dataurl转成blob对象
     */
    public dataURL2Blob(dataURI) {
        let byteStr, intArray, ab, i, mimetype, parts;

        parts = dataURI.split(',');

        if (~parts[0].indexOf('base64')) {
            byteStr = atob(parts[1]);
        } else {
            byteStr = decodeURIComponent(parts[1]);
        }

        ab = new ArrayBuffer(byteStr.length);
        intArray = new Uint8Array(ab);

        for (i = 0; i < byteStr.length; i++) {
            intArray[i] = byteStr.charCodeAt(i);
        }

        mimetype = parts[0].split(':')[1].split(';')[0];

        return this.arrayBufferToBlob(ab, mimetype);
    }

    /**
     * dataURL2ArrayBuffer    把dataurl转成arraybuffer
     * @dataURL string 文件的base64 url
     */
    public dataURL2ArrayBuffer(dataURI: string) {
        let byteStr, intArray, i, parts;

        parts = dataURI.split(',');

        if (~parts[0].indexOf('base64')) {
            byteStr = atob(parts[1]);
        } else {
            byteStr = decodeURIComponent(parts[1]);
        }

        intArray = new Uint8Array(byteStr.length);

        for (i = 0; i < byteStr.length; i++) {
            intArray[i] = byteStr.charCodeAt(i);
        }

        return intArray.buffer;
    }

    /**
     * arrayBufferToBlob 从array buffer转为blob
     */
    public arrayBufferToBlob(buffer, type) {
        let builder = window.BlobBuilder || window.WebKitBlobBuilder,
            bb;

        // android不支持直接new Blob, 只能借助blobbuilder.
        if (builder) {
            bb = new builder();
            bb.append(buffer);
            return bb.getBlob(type);
        }

        return new Blob([buffer], type ? { type: type } : {});
    }

    /**
     * canvasToDataURL canvas转dataurl
     */
    public canvasToDataURL(canvas, type, quality) {
        return canvas.toDataURL(type, quality / 100);
    }
}