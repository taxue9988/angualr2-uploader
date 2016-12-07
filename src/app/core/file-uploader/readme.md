#使用说明
1、创建一个component继承uploader-file.component.ts
2、创建一个uploader实例
3、设置options,具体配置说明见interface中，各个文件里已经注明
4、注册事件，至少调用uploader-file中的fileTransport方法，注册文件传输事件，所有文件上传使用都会调用所注册的方法。
5、onChange与reselect方法具体见示例。

注：事件使用的是静态方式