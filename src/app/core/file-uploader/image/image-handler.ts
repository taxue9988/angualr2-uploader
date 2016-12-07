/**
 *
 */

import { System } from 'app/core';

export class ImageHandler {

    private _img: HTMLImageElement;

    private _canvas: HTMLCanvasElement;

    private modified: boolean = false;

    private _file;

    private maxMetaDataSize: number = 262144;

    private parsers = {
        0xffe1: []
    };


    constructor(file, imageWidth?: number, imageHeight?: number) {
        let self = this;
        this._file = file;
        this.img = new Image();
        if (imageWidth !== undefined) {
            this.img.width = imageWidth;
        }

        if (imageHeight !== undefined) {
            this.img.height = imageHeight;
        }

        this.img.onload = function () {

        };

        this.img = file;
    }

    // image设置
    public get img(): HTMLImageElement {
        return this._img;
    }
    public set img(v: HTMLImageElement) {
        this._img = v;
    }

    // canvas element
    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
    public set canvas(v: HTMLCanvasElement) {
        this._canvas = v;
    }


    /**
     * setSize 设置图片的宽高
     * @width number 宽
     * @height number 高
     */
    public setSize(width: number, height: number) {
        if (this._img) {
            this.img.width = width;
            this.img.height = height;
        }
    }

    /**
     * resize    改变图片尺寸
     * @width number 宽
     */
    public resize(width: number) {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
        }

        this.modified = true;
        return this._resize(this._img, this._canvas, width);
    }

    /**
     * toDataUrl    生成图片的data-url
     */
    public toDataUrl(canvas) {
        return canvas.toDataUrl('image/jpeg', 1);
    }

    /**
     * 尺寸处理
     * @img 图片对象
     * @canvas canvas
     * @width number 缩放的宽度
     */
    private _resize(img: HTMLImageElement, canvas: HTMLCanvasElement, width: number) {
        let oWidth = img.width,
            oHeight = img.height,
            w, h, x, y;


        let scale = width / oWidth;

        w = oWidth * scale;
        h = oHeight * scale;

        canvas.width = w;
        canvas.height = h;



        x = (canvas.width - w) / 2;
        y = (canvas.height - h) / 2;


        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, x, y, w, h);
        return canvas.toDataURL();
    }

    //使用canvas对图片进行缩放处理
    private renderImageToCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement, x, y, w, h) {


    }

}