export interface ChunkInterface{
    chunked: boolean;    //是否要分片处理大文件上传
    chunkSize?: Number;    // 如果要分片，每片的大小，默认设置为5M
    chunkRetry?: number; // 如果分片上传失败，允许自动重复多少次
}