import { Md5 } from './md5';
declare var unescape;
declare let Uint8Array;

/**
 *
 */
export class AArrayBuffer {
    public _buff = new Uint8Array(0);
    public _length = 0;
    public _hash = [1732584193, -271733879, -1732584194, 271733878];

    private md5: Md5;

    constructor() {
        this.md5 = new Md5();
    }

    public toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    public utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
            buff = new ArrayBuffer(length),
            arr = new Uint8Array(buff),
            i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    public arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    public concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    public hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {AArrayBuffer} The instance itself
     */
    public append(arr) {
        var buff = this.concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            this.md5.md5cycle(this._hash, this.md5.md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    public end(raw?: boolean) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = this.md5.hex(this._hash);

        if (raw) {
            ret = this.hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };


    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    public getState() {
        // Convert buffer to a string
        this._buff = this.arrayBuffer2Utf8Str(this._buff);

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {AArrayBuffer} The instance itself
     */
    public setState(state) {
        // Convert string to buffer
        this._buff = this.utf8Str2ArrayBuffer(this._buff, true);
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    public destroy() {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    public reset() {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    public _finish(tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            this.md5.md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        this.md5.md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     raw True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    public hash(arr, raw) {
        var hash = this.md5.md51_array(new Uint8Array(arr)),
            ret = this.md5.hex(hash);

        return raw ? this.hexToBinaryString(ret) : ret;
    };
}