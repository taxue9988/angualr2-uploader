import { AcceptInterface } from './accept-options.interface';
import { ThumbOptionsInterface } from './thumb-options.interface';
import { TransportOptionsInterface } from './transport-options.interface';
import { UploadFileOptionsnInterface } from './upload-file-options.interface';
import { CompressInterface } from './compress-options.interface';
import { ChunkInterface } from './chunk-options.interface';
import { PickOptionsInterface } from './pick-options.interface';

export interface UploadOptionsInterface {
    pick?: PickOptionsInterface;
    accept?: AcceptInterface;
    chunk?: ChunkInterface;
    compress?: CompressInterface;
    thumb?: ThumbOptionsInterface,
    transport: TransportOptionsInterface,
    file?: UploadFileOptionsnInterface,
    // 预览设置
    preview?: {
        width?: number,
    }
}