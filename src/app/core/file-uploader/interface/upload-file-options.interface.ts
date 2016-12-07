// 针对单个文件进行配置
export interface UploadFileOptionsnInterface{
    fileNumLimit?: Number; // 文件总数量，超出不允许加入队列
    fileSizeLimit?: Number;    //验证文件总大小是否超出限制，超出限制则不允许加入队列
    fileSingleSizeLimit?: Number;    // 验证单个文件大小是否超出限制，走出不允许加入队列
    duplicate?: boolean;    // 去重，根据文件名、大小和最后修改的时候来生成hash key
    sendAsBinary?: boolean;    //默认false,是否使用二进制流方式发送文件，这样整个上传的文件内容都在php://input中，其它参数在$_GET中
}