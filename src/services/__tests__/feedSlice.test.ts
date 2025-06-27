import { feedReducer, initialState, fetchFeeds } from '../slices/feedSlice';

describe('feedSlice тесты', () => {
  global.fetch = jest.fn();

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

  const mockFeed = {
    success: true,
    orders: [mockOrder],
    total: 98,
    totalToday: 82245,
    error: null,
    isLoaded: true
  };

  test('fetchFeeds.pending', () => {
    const state = feedReducer(initialState, fetchFeeds.pending('pending'));

    expect(state.loading).toBeTruthy();
    expect(state.error).toBeNull();
  });

  test('fetchFeeds.fulfilled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: mockFeed })
      })
    ) as jest.Mock;

    const state = feedReducer(
      initialState,
      fetchFeeds.fulfilled(mockFeed, 'fulfilled')
    );

    expect(state.loading).toBeFalsy();
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockFeed.orders);
    expect(state.total).toEqual(mockFeed.total);
    expect(state.totalToday).toEqual(mockFeed.totalToday);
  });

  test('fetchFeeds.rejected', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('error'))
      })
    ) as jest.Mock;

    const state = feedReducer(
      initialState,
      fetchFeeds.rejected(null, 'rejected')
    );
  });
});
