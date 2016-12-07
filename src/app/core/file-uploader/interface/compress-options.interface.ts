export interface CompressInterface{
    width: Number; // 宽
    height: Number; // 高
    quality: Number;  // 图片质量
    allowMagnify: boolean; // 是否允许放大
    crop: boolean;    //是否允许裁剪
    preserveHeaders: boolean;    //是否保留头部meta信息
    noCompressIfLarger: boolean;    //如果 发现压缩后文件比原文件还大刚使用原文件(只对图片有用)
    compressSize: Number; // 如果图片大小小于该值则不压缩
}