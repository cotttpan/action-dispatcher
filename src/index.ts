import { EventEmitter2, ConstructorOptions } from 'eventemitter2';
import { identity } from '@cotto/utils.ts';

export interface Action<P = any> {
    type: string;
    payload?: P;
    [k: string]: any;
}

export interface Middleware {
    (action: Action): Action;
}

export interface Options extends ConstructorOptions {
    middleware?: Middleware;
}

export default class ActionDispatcher<T = any> extends EventEmitter2 {
    middleware: Middleware = identity;

    constructor(opts?: Options) {
        super(opts);
        this.middleware = opts && opts.middleware || identity;
    }

    dispatch(action: Action): Action;
    dispatch<K extends keyof T>(type: K, payload: T[K]): Action;
    dispatch(type: string | Action, payload?: any): Action {
        const action: Action = typeof type === 'string' ? { type, payload } : type;
        super.emit(action.type, this.middleware(action));
        return action;
    }

    subscribe<K extends keyof T>(listener: (type: K, action: Action<T[K]>) => void) {
        super.onAny(listener);
        return () => super.offAny(listener);
    }
}
