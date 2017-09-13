import { EventEmitter2 } from 'eventemitter2';

export type Listener<T, K extends keyof T> = (arg: T[K]) => void;

export interface Action {
    type: string;
    payload?: any;
    [k: string]: any;
}

export default class ActionDispatcher<T = any> extends EventEmitter2 {
    on<K extends keyof T>(event: K, listener: Listener<T, K>) {
        return super.on(event, listener);
    }

    once<K extends keyof T>(event: K, listener: Listener<T, K>) {
        return super.once(event, listener);
    }

    off<K extends keyof T>(event: K, listener: Listener<T, K>) {
        return super.removeListener(event, listener);
    }

    emit<K extends keyof T>(event: K, arg: T[K]) {
        return super.emit(event, arg);
    }

    dispatch(action: Action): Action;
    dispatch<K extends keyof T>(type: K, payload: T[K]): Action;
    dispatch(type: string | Action, payload?: any): Action {
        const action: Action = typeof type === 'string' ? { type, payload } : type;
        super.emit(action.type, action.payload);
        return action;
    }

    async dispatchAsync(action: Action): Promise<Action>;
    async dispatchAsync<K extends keyof T>(type: K, payload: T[K]): Promise<Action>;
    async dispatchAsync(type: string | Action, payload?: any): Promise<Action> {
        const action: Action = typeof type === 'string' ? { type, payload } : type;
        await super.emitAsync(action.type, action.payload);
        return action;
    }

    subscribe<K extends keyof T>(listener: (type: K, payload: T[K]) => void) {
        super.onAny(listener);
        return () => super.offAny(listener);
    }
}
