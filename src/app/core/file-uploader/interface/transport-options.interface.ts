export interface TransportOptionsInterface {
    server: String;
    auto?: boolean; //设置true后不需要手动提交，文件选择后即开始上传
    prepareNextFile?: boolean;    //是否允许在文件传输时提前把下一个文件准备好。
    threads?: Number;    // 上传并发数，允许同时最大上传进程数。
    formData?: any;    // 文件上传时请求的参数列表，每次请求都发送
    fileVal?: any;     // 设置文件上传域的name
    method?: String; // 设置文件上传方式，默认POST
}
