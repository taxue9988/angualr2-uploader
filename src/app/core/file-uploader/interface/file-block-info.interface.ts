import { WrapFile } from '../wrap-file';

export interface FileBlockInfoInterface {
    file: WrapFile,
    total:number,
    start: number,
    end: number,
    chunks: number,
    chunk: number,
    cuted: any
}