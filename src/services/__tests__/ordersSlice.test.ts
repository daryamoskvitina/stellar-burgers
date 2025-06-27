import {
  ordersReducer,
  initialState,
  createOrder,
  fetchOrderByNumber,
  fetchAllOrders
} from '../slices/ordersSlice';

const mockOrder = {
  _id: '685bf30e5a54df001b6d96fd',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0946'
  ],
  status: 'done',
  name: 'Краторный минеральный бургер',
  createdAt: '2025-06-25T13:01:02.667Z',
  updatedAt: '2025-06-25T13:01:03.474Z',
  number: 82619
};

describe('orderSlice тесты', () => {
  test('fetchOrderByNumber.pending', async () => {
    const orderNumber = 77777;
    const state = ordersReducer(
      initialState,
      fetchOrderByNumber.pending('pending', orderNumber)
    );

    expect(state).toEqual({
      ...initialState
    });
  });

  test('fetchOrderByNumber.fulfilled', () => {
    const orderNumber = 77777;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, orders: [mockOrder] })
      })
    ) as jest.Mock;

    const state = ordersReducer(
      initialState,
      fetchOrderByNumber.fulfilled(
        { success: true, orders: [mockOrder] },
        'fulfilled',
        orderNumber
      )
    );

    expect(state.currentOrder).toEqual(mockOrder);
  });

  test('fetchOrderByNumber.rejected', () => {
    const orderNumber = 77777;
    const state = ordersReducer(
      initialState,
      fetchOrderByNumber.rejected(new Error('Ошибка'), 'rejected', orderNumber)
    );

    expect(state.errorFetch).toBe('Ошибка при получении заказа по номеру');
  });

  test('createOrder.pending', async () => {
    const state = ordersReducer(
      initialState,
      createOrder.pending('pending', mockOrder.ingredients)
    );

    expect(state.request).toBeTruthy();
  });

  test('createOrder.fulfilled', () => {
    const state = ordersReducer(
      initialState,
      createOrder.fulfilled(
        { success: true, order: mockOrder, name: 'name' },
        'fulfilled',
        mockOrder.ingredients
      )
    );

    expect(state.currentOrder).toEqual(mockOrder);
  });

  test('createOrder.rejected', () => {
    const state = ordersReducer(
      initialState,
      createOrder.rejected(new Error('error'), 'rejected', [])
    );

    expect(state.errorCreate).toContain('Ошибка создания заказа');
  });

  test('fetchAllOrders.pending', async () => {
    const state = ordersReducer(
      initialState,
      fetchAllOrders.pending('pending')
    );

    expect(state).toEqual({ ...initialState });
  });

  test('fetchAllOrders.fulfilled', async () => {
    const state = ordersReducer(
      initialState,
      fetchAllOrders.fulfilled([mockOrder], 'fulfilled')
    );

    expect(state.viewOrders).toEqual([mockOrder]);
  });

  test('fetchAllOrders.rejected', () => {
    const state = ordersReducer(
      initialState,
      fetchAllOrders.rejected(new Error('Ошибка'), 'rejected')
    );

    expect(state.errorOrders).toContain('Ошибка загрузки списка заказов');
  });
});
