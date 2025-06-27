import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

type IngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string;
};

export const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: ''
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Ошибка при загрузке ингредиентов';
      });
  },
  selectors: {
    selectIngredientState: (state) => state.ingredients,
    selectIngredientsLoading: (state) => state.loading,
    selectIngredientsError: (state) => state.error
  }
});

export const {
  selectIngredientState,
  selectIngredientsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
