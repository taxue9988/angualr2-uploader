export interface browserInfo {
    webkit?: any;
    chrome?: any;
    ie?: any;
    firefox?: any;
    safari?: any;
    opera?: any;
}

export interface osInterface{
    osx?: boolean;
    windows?: boolean;
    android?: number;
    ios?: number;
}

export class System {
    public static ua: string = navigator.userAgent;


    public static browser() {
        let ret: browserInfo = {},
            webkit: any[] = this.ua.match(/WebKit\/([\d.]+)/),
            chrome = this.ua.match(/Chrome\/([\d.]+)/) ||
                this.ua.match(/CriOS\/([\d.]+)/),
            ie = this.ua.match(/MSIE\s([\d\.]+)/) ||
                this.ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
            firefox = this.ua.match(/Firefox\/([\d.]+)/),
            safari = this.ua.match(/Safari\/([\d.]+)/),
            opera = this.ua.match(/OPR\/([\d.]+)/);

        webkit && (ret.webkit = parseFloat(webkit[1]));
        chrome && (ret.chrome = parseFloat(chrome[1]));
        ie && (ret.ie = parseFloat(ie[1]));
        firefox && (ret.firefox = parseFloat(firefox[1]));
        safari && (ret.safari = parseFloat(safari[1]));
        opera && (ret.opera = parseFloat(opera[1]));

        return ret;
    }

    public static os() {
        var ret: osInterface = {},

            osx = !!this.ua.match(/\(Macintosh\; Intel /),
            windows = (this.ua.indexOf("Windows", 0) != -1),
            android = this.ua.match(/(?:Android);?[\s\/]+([\d.]+)?/),
            ios = this.ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);

        osx && (ret.osx = true);
        windows && (ret.windows = true);
        android && (ret.android = parseFloat(android[1]));
        ios && (ret.ios = parseFloat(ios[1].replace(/_/g, '.')));
        return ret;
    }

    public static guid(prefix: string = '') {
        var counter = 0;

        var guid = (+new Date()).toString(32),
            i = 0;

        for (; i < 5; i++) {
            guid += Math.floor(Math.random() * 65535).toString(32);
        }

        return (prefix || 'g_') + guid + (counter++).toString(32);
    }

    /**
     * 格式化文件大小, 输出成带单位的字符串
     * @method formatSize
     */
    public static formatSize(size: number, pointLength?: number, units?: any[]): string {
        var unit;

        units = units || ['B', 'K', 'M', 'G', 'TB'];

        while ((unit = units.shift()) && size > 1024) {
            size = size / 1024;
        }

        return (unit === 'B' ? size : size.toFixed(pointLength || 2)) +
            unit;
    }

    /**
     * isEmptyObject 是否为空对象
     */
    public static isEmptyObject(e) {
        for (let key in e) return !1;
        return !0;
    }

}
