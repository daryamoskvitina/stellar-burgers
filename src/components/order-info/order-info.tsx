import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectIngredientState } from '../../services/slices/ingredientSlice';
import { TIngredient } from '@utils-types';
import {
  fetchOrder,
  fetchOrderByNumber
} from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const id = Number(number);
  const orderData = useSelector(fetchOrder);

  useEffect(() => {
    dispatch(fetchOrderByNumber(id));
  }, [dispatch, id]);

  const ingredients: TIngredient[] = useSelector(selectIngredientState).filter(
    (ingredient) => orderData?.ingredients.includes(ingredient._id)
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    const date = new Date(orderData.createdAt);
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);
  if (!orderInfo) {
    return <Preloader />;
  }
  return <OrderInfoUI orderInfo={orderInfo} />;
};
