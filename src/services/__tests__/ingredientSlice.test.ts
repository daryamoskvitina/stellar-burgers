import {
  ingredientsReducer,
  initialState,
  fetchIngredients
} from '../slices/ingredientSlice';

describe('ingredientSlice тесты', () => {
  global.fetch = jest.fn();

  const mockIngredientsBun = {
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
    __v: 0
  };

  const mockIngredientsSauce = {
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
    __v: 0
  };

  test('fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('pending')
    );

    expect(state.loading).toBeTruthy();
    expect(state.error).toBe('');
  });

  test('fetchIngredients.fulfilled', () => {
    const mockIngredients = [mockIngredientsBun, mockIngredientsSauce];
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, 'fulfilled')
    );

    expect(state.loading).toBeFalsy();
    expect(state.error).toBe('');
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(new Error('Ошибка'), 'rejected')
    );

    expect(state.error).toBe('Ошибка при загрузке ингредиентов');
  });
});
