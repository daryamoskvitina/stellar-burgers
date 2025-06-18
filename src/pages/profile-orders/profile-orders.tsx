import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchAllOrders,
  fetchAllViewOrders,
  fetchOrderError
} from '../../services/slices/ordersSlice';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(fetchAllViewOrders);
  const error = useSelector(fetchOrderError);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
