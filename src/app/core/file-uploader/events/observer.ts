/**
 * Observer    订阅
 */
export class Observer {
    // 回调函数
    private callbackFn: Function;
    // 上下文
    private context: any;

    constructor(callbackFn:Function,context:any) {
        let self = this;
        self.callbackFn = callbackFn;
        self.context = context;
    }

    /**
     * notify    通知
     * @args any[] 不定参数，传给callbackFn
     */
    public notify(...args: any[]): void {
        let self = this;
        self.callbackFn.call(self.context, ...args);
    }

    /**
     * compar 上下文对比
     * @context 上下文
     */
    public compar(context: any): boolean {
        return context == this.context;
    }
}