import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type OrderState = {
  request: boolean;
  currentOrder: TOrder | null;
  viewOrders: TOrder[];
  errorCreate: string | null;
  errorFetch: string | null;
  errorOrders: string;
};

export const initialState: OrderState = {
  request: false,
  currentOrder: null,
  viewOrders: [],
  errorCreate: null,
  errorFetch: null,
  errorOrders: ''
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (data: string[]) => {
    const dataUserOrder = await orderBurgerApi(data);
    return dataUserOrder;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  (number: number) => getOrderByNumberApi(number)
);

export const fetchAllOrders = createAsyncThunk('order/fetchAllOrders', () =>
  getOrdersApi()
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.request = true;
        state.errorCreate = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.request = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.request = false;
        state.errorCreate = 'Ошибка создания заказа';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.errorFetch = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.errorFetch = 'Ошибка при получении заказа по номеру';
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.viewOrders = [];
        state.errorOrders = '';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.viewOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state) => {
        state.errorOrders = 'Ошибка загрузки списка заказов';
      });
  },
  selectors: {
    fetchOrder: (state) => state.currentOrder,
    fetchAllViewOrders: (state) => state.viewOrders,
    fetchOrderRequest: (state) => state.request,
    fetchOrderError: (state) => state.errorOrders
  }
});

export const {
  fetchOrder,
  fetchAllViewOrders,
  fetchOrderRequest,
  fetchOrderError
} = orderSlice.selectors;

export const { clearCurrentOrder } = orderSlice.actions;
export const ordersReducer = orderSlice.reducer;
export const userOrderName = orderSlice.name;
