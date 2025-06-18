import { FC, useEffect } from 'react';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { TOrder } from '@utils-types';

import {
  fetchFeeds,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!orders.length || loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
