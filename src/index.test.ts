import Dispatcher from './index';

interface ActionMap {
    'a': number;
    [k: string]: any;
}
const actionA = (n: number) => ({ type: 'a', payload: n });

test('subscribe/unsubscribe', () => {
    const dispatcher = new Dispatcher<ActionMap>();

    const mock = jest.fn();
    /* subscribe */
    const unsubscribe = dispatcher.subscribe(mock);
    expect(dispatcher.listenersAny()).toEqual([mock]);
    /* unsubscribe */
    unsubscribe();
    expect(dispatcher.listenersAny()).toEqual([]);
});

describe('dispatch', () => {
    const dispatcher = new Dispatcher<ActionMap>();
    const listener = jest.fn();
    let unsubscribe;

    beforeEach(() => {
        unsubscribe = dispatcher.subscribe(listener);
    });

    afterEach(() => {
        unsubscribe();
    });

    test('dispatch with type and payload', () => {
        expect.assertions(2);
        const action = dispatcher.dispatch('a', 1);
        expect(action).toEqual({ type: 'a', payload: 1 });
        expect(listener).toBeCalledWith('a', { type: 'a', payload: 1 });
    });

    test('dispatch with action object', () => {
        expect.assertions(2);
        const action = dispatcher.dispatch(actionA(1));
        expect(action).toEqual({ type: 'a', payload: 1 });
        expect(listener).toBeCalledWith('a', { type: 'a', payload: 1 });
    });
});

test('middleware', (done) => {
    expect.assertions(1);

    const dispatcher = new Dispatcher({
        middleware: (action) => Object.assign({}, action, { meta: 'meta' })
    });

    dispatcher.subscribe((type, action) => {
        expect(action).toEqual({ type: 'a', payload: 1, meta: 'meta' });
        done();
    });

    dispatcher.dispatch(actionA(1));
});

