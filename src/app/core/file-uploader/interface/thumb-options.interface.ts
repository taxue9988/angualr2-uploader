export interface ThumbOptionsInterface {
    width: Number; // 宽
    height: Number;  // 高
    quality?: Number; // 图片质量
    allowMagnify?: boolean; // 是否允许放大
    crop?: boolean; // 是否允许裁剪
    type?: string;  // 为空则保留原图片的格式，否则强制转换成指定的类型
}