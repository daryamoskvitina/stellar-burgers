import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';

import {
  selectConstructorBun,
  selectConstructorIngredients,
  clearConstructor
} from '../../services/slices/constructorSlice';

import {
  createOrder,
  fetchOrder,
  clearCurrentOrder,
  fetchOrderRequest
} from '../../services/slices/ordersSlice';

import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../services/slices/authSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const orderRequest = useSelector(fetchOrderRequest);
  const orderModalData = useSelector(fetchOrder);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const orderArray = [
      bun._id,
      bun._id,
      ...ingredients.map((elem) => elem._id)
    ];
    dispatch(createOrder(orderArray));
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
