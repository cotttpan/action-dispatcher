import Dispatcher from './index';

interface ActionMap {
    'a': number;
    [k: string]: any;
}
const actionA = (n: number) => ({ type: 'a', payload: n });

const dispatcher = new Dispatcher<ActionMap>();

test('subscribe/unsubscribe', () => {
    const mock = jest.fn();
    /* subscribe */
    const unsubscribe = dispatcher.subscribe(mock);
    expect(dispatcher.listenersAny()).toEqual([mock]);
    /* unsubscribe */
    unsubscribe();
    expect(dispatcher.listenersAny()).toEqual([]);
});

describe('dispatch/dispatchAsync', () => {
    const mock = jest.fn();
    const mock2 = jest.fn();
    let unsubscribe;

    beforeEach(() => {
        dispatcher.on('a', mock);
        unsubscribe = dispatcher.subscribe(mock2);
    });

    afterEach(() => {
        dispatcher.off('a', mock);
        unsubscribe();
    });

    describe('dispatch', () => {
        test('dispatch with type and payload', () => {
            const action = dispatcher.dispatch('a', 1);
            expect(action).toEqual({ type: 'a', payload: 1 });
            expect(mock).toBeCalledWith(1);
            expect(mock2).toBeCalledWith('a', 1);
        });

        test('dispatch with action object', () => {
            const action = dispatcher.dispatch(actionA(1));
            expect(action).toEqual({ type: 'a', payload: 1 });
            expect(mock).toBeCalledWith(1);
            expect(mock2).toBeCalledWith('a', 1);
        });
    });

    describe('dispatchAsync', () => {
        test('dispatchAsync with type and payload', async () => {
            const action = await dispatcher.dispatchAsync('a', 1);
            expect(action).toEqual({ type: 'a', payload: 1 });
            expect(mock).toBeCalledWith(1);
            expect(mock2).toBeCalledWith('a', 1);
        });

        test('dispatchAsync with action object', async () => {
            const action = await dispatcher.dispatchAsync(actionA(1));
            expect(action).toEqual({ type: 'a', payload: 1 });
            expect(mock).toBeCalledWith(1);
            expect(mock2).toBeCalledWith('a', 1);
        });
    });
});

