import { FC } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '../../components/ui';
import { ConstructorPageUI } from '@ui-pages';
import { selectIngredientsLoading } from '../../services/slices/ingredientSlice';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />
      )}
    </>
  );
};
