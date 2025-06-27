import store, { rootReducer } from '../store';

describe('store тесты', () => {
  test('Вызов с неизвестным экшеном', () => {
    const beforUndefined = store.getState();
    const afterUndefined = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(afterUndefined).toEqual(beforUndefined);
  });
});
