/**
 * 文件类型，mime-type 相关处理
 */

import { MimeTypes } from './mime-types';

export class UploaderFileType extends MimeTypes {

    // 通过文件扩展名找到对应的mime-type
    getAccepts(extensions: string) {
        let exts = extensions.split(','),
            accept = '';

        for (let i = 0; i < exts.length; i++) {
            let ext = this.getMimeType(exts[i]);
            if (typeof ext === 'object') {
                accept += ext.join(',') + ',';
            } else {
                accept += ext + ',';
            }
        }

        return accept;
    }
}