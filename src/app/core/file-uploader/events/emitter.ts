/**
 * Emitter 事件
 */

import { Observer } from './observer';

export class Emitter {
    // 事件数组
    private static listeners = {};

    /**
     * register    注册事件
     * @eventName string 事件名称
     * @callback Function 回调函数，事件触发时执行
     * @context any 事件执行的上下文
     */
    public static register(eventName: string, callback: Function, context: any) {

        let observers: Observer[] = Emitter.listeners[eventName];
        if (!observers) {
            Emitter.listeners[eventName] = [];
        }

        Emitter.listeners[eventName].push(new Observer(callback, context));
    }

    /**
     * remove    移除事件
     * @name string 事件名称
     * @callbackFn Function 回调函数，事件触发时执行
     * @context any 上下文，需要与注册时的保持一致
     */
    public static remove(name: string, callbackFn: Function, context: any) {
        let observers: Observer[] = Emitter.listeners[name];
        if (!observers) return;

        let len = observers.length;
        for (let i = 0; i < len; i++) {
            let observer = observers[i];
            if (observer && observer.compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }
    }

    /**
     * trigger    触发事件(发送事件)
     * @name string 事件名称
     * @args any[] 参数
     */
    public static trigger(name: string, ...args: any[]) {
        let observers: Observer[] = Emitter.listeners[name];
        if (!observers) return;

        let len = observers.length;
        for (let i = 0; i < len; i++) {
            let observer = observers[i];
            observer.notify(...args);
        }
    }
}