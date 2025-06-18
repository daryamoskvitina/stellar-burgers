import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ленту заказов';
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotals: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    }),
    selectFeedLoading: (state) => state.loading,
    selectFeedError: (state) => state.error
  }
});

export const {
  selectFeedOrders,
  selectFeedTotals,
  selectFeedLoading,
  selectFeedError
} = feedSlice.selectors;
export const feedReducer = feedSlice.reducer;
export const feedName = feedSlice.name;
