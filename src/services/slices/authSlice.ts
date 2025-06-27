import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import { clearConstructor } from './constructorSlice';
import { clearCurrentOrder } from './ordersSlice';

export interface TAuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  updateError: string;
  loginUserError: string;
  errorRegistration: string;
  errorLogout: string;
}

export const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false,
  updateError: '',
  loginUserError: '',
  errorRegistration: '',
  errorLogout: ''
};

export const register = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutApi();
      dispatch(clearConstructor());
      dispatch(clearCurrentOrder());
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(fetchUser());
    }
    dispatch(setAuthChecked());
  }
);

const clearAuthInfo = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.errorRegistration = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.errorRegistration = '';
      })
      .addCase(register.rejected, (state, action) => {
        state.errorRegistration =
          (action.payload as string) || 'Ошибка регистрации';
      })

      .addCase(login.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginUserError = '';
      })
      .addCase(login.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = (action.payload as string) || 'Ошибка входа';
      })

      .addCase(logout.pending, (state) => {
        state.loginUserRequest = true;
        state.errorLogout = '';
      })
      .addCase(logout.fulfilled, (state) => {
        state.loginUserRequest = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.clear();
        deleteCookie('accessToken');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.errorLogout = (action.payload as string) || 'Ошибка выхода';
      })

      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.updateError = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload;
        state.updateError = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.updateError = (action.payload as string) || 'Ошибка обновления';
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        clearAuthInfo();
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectLoginLoading: (state) => state.loginUserRequest,
    selectUserError: (state) => state.loginUserError,
    selectAllAuthErrors: (state) => ({
      registration: state.errorRegistration,
      login: state.loginUserError,
      logout: state.errorLogout,
      update: state.updateError
    })
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectLoginLoading,
  selectUserError,
  selectAllAuthErrors
} = authSlice.selectors;

export const { setAuthChecked } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const userName = authSlice.name;
