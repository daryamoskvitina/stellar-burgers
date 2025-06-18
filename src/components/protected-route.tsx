import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from './ui/preloader';
import { selectIsAuthChecked, selectUser } from '../services/slices/authSlice';

const PATHS = {
  HOME: '/',
  LOGIN: '/login'
} as const;

interface ProtectedRouteProps {
  onlyUnauth?: boolean;
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnauth = false,
  children
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  const isAuthenticated = user !== null && user !== undefined;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnauth && isAuthenticated) {
    const from = location.state?.from || { pathname: PATHS.HOME };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export type { ProtectedRouteProps };
