import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() } as TConstructorIngredient
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveItem: (
      state,
      action: PayloadAction<{ index: number; newIndex: number }>
    ) => {
      const { index, newIndex } = action.payload;
      const [removed] = state.ingredients.splice(index, 1);
      state.ingredients.splice(newIndex, 0, removed);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectConstructorIngredients: (state) => state.ingredients,
    selectConstructorBun: (state) => state.bun,
    selectConstructorState: (state) => state
  }
});

export const { addIngredient, removeIngredient, moveItem, clearConstructor } =
  constructorSlice.actions;

export const {
  selectConstructorIngredients,
  selectConstructorBun,
  selectConstructorState
} = constructorSlice.selectors;

export const constructorReducer = constructorSlice.reducer;
export const burgerName = constructorSlice.name;
