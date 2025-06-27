import {
  constructorReducer,
  initialState,
  addIngredient,
  removeIngredient,
  moveItem,
  clearConstructor
} from '../slices/constructorSlice';

const mockBun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
  id: '569849'
};

const mockSauce = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0,
  id: '84159'
};

const mockMain = {
  _id: '643d69a5c3f7b9001cfa0946',
  name: 'Хрустящие минеральные кольца',
  type: 'main',
  proteins: 808,
  fat: 689,
  carbohydrates: 609,
  calories: 986,
  price: 300,
  image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
  image_mobile:
    'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
  __v: 0,
  id: '54265'
};

describe('constructorSlice тесты', () => {
  test('addIngredient.bun', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));

    expect(state.bun).toEqual({ ...mockBun, id: expect.any(String) });
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient.sauce', () => {
    const state = constructorReducer(initialState, addIngredient(mockSauce));

    expect(state.ingredients[0]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
    expect(state.ingredients).toHaveLength(1);
  });

  test('moveItem тест', () => {
    const array = [mockSauce, mockMain];
    const _initialState = {
      bun: null,
      ingredients: array
    };

    const payload = { index: 0, newIndex: 1 };

    const state = constructorReducer(_initialState, moveItem(payload));

    expect(state.ingredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
    expect(state.ingredients[1]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
  });

  test('moveItem тест 2', () => {
    const array = [mockMain, mockSauce];
    const _initialState = {
      bun: null,
      ingredients: array
    };

    const payload = { index: 1, newIndex: 0 };

    const state = constructorReducer(_initialState, moveItem(payload));

    expect(state.ingredients[0]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
    expect(state.ingredients[1]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
  });

  test('removeIngredient тест', () => {
    const _initialState = {
      bun: null,
      ingredients: [mockMain, mockSauce]
    };

    const state = constructorReducer(
      _initialState,
      removeIngredient(mockMain.id)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
  });

  test('clearConstructor тест', () => {
    const _initialState = {
      bun: mockBun,
      ingredients: [mockSauce, mockMain]
    };

    const state = constructorReducer(_initialState, clearConstructor());
    expect(state.ingredients).toHaveLength(0);
    expect(state.bun).toBeNull();
  });
});
