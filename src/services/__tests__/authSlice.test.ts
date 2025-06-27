import {
  authReducer,
  initialState,
  register,
  login,
  logout,
  updateUser,
  fetchUser,
  setAuthChecked
} from '../slices/authSlice';
import { deleteCookie } from '../../utils/cookie';

const mockUser = {
  email: 'test-profile@yandex.ru',
  name: 'Дарья'
};

const mockRegister = {
  email: 'test-profile@yandex.ru',
  name: 'Дарья',
  password: 'password123'
};

const mockLogin = {
  email: 'test-profile@yandex.ru',
  password: 'password123'
};

global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(() => null),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn((index) => null)
};

jest.mock('../../utils/cookie', () => ({
  deleteCookie: jest.fn()
}));

describe('authSlice тесты', () => {
  describe('register экшены', () => {
    test('register.pending', () => {
      const state = authReducer(
        initialState,
        register.pending('requestId', mockRegister)
      );

      expect(state).toEqual(initialState);
    });

    test('register.fulfilled: сохраняет пользователя', () => {
      const state = authReducer(
        initialState,
        register.fulfilled(mockUser, 'fulfilled', mockRegister)
      );

      expect(state.user).toEqual(mockUser);
    });

    test('register.rejected', () => {
      const error = new Error('Ошибка');
      const state = authReducer(
        initialState,
        register.rejected(error, 'rejected', mockRegister)
      );

      expect(state.errorRegistration).toContain('Ошибка регистрации');
    });
  });

  describe('login экшены', () => {
    test('login.pending', () => {
      const state = authReducer(
        initialState,
        login.pending('pending', mockLogin)
      );

      expect(state.loginUserRequest).toBeTruthy();
    });

    test('login.fulfilled', () => {
      const state = authReducer(
        initialState,
        login.fulfilled(mockUser, 'fulfilled', mockLogin)
      );

      expect(state.loginUserRequest).toBeFalsy();
      expect(state.user).toEqual(mockUser);
    });

    test('login.rejected', () => {
      const error = new Error('Ошибка');
      const state = authReducer(
        initialState,
        login.rejected(error, 'rejected', mockLogin)
      );

      expect(state.loginUserRequest).toBeFalsy();
      expect(state.loginUserError).toContain('Ошибка входа');
    });
  });

  describe('logout экшены', () => {
    test('logout.pending', () => {
      const state = authReducer(initialState, logout.pending('pending'));

      expect(state.loginUserRequest).toBeTruthy();
    });

    test('logout.fulfilled: очищает данные', () => {
      const state = authReducer(
        initialState,
        logout.fulfilled(undefined, 'fulfilled')
      );

      expect(global.localStorage.clear).toHaveBeenCalled();
      expect(deleteCookie).toHaveBeenCalled();
      expect(state.loginUserRequest).toBeFalsy();
      expect(state.user).toBeNull();
    });
  });

  describe('updateUser экшены', () => {
    test('updateUser.pending', () => {
      const state = authReducer(
        initialState,
        updateUser.pending('pending', mockLogin)
      );

      expect(state.loginUserRequest).toBeTruthy();
    });

    test('updateUser.fulfilled', () => {
      const state = authReducer(
        initialState,
        updateUser.fulfilled(mockUser, 'fulfilled', mockUser)
      );

      expect(state.loginUserRequest).toBeFalsy();
      expect(state.user).toEqual(mockUser);
    });

    test('updateUser.rejected', () => {
      const error = new Error('Ошибка');
      const state = authReducer(
        initialState,
        updateUser.rejected(error, 'rejected', mockRegister)
      );

      expect(state.updateError).toContain('Ошибка обновления');
    });
  });

  describe('fetchUser экшены', () => {
    test('fetchUser.fulfilled: устанавливает пользователя', () => {
      const state = authReducer(
        initialState,
        fetchUser.fulfilled(mockUser, 'fulfilled')
      );

      expect(state.user).toEqual(mockUser);
    });
  });

  describe('Вспомогательные экшены', () => {
    test('setAuthChecked: устанавливает флаг проверки', () => {
      const state = authReducer(initialState, setAuthChecked());

      expect(state.isAuthChecked).toBeTruthy();
    });
  });
});
