import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  login,
  selectLoginLoading,
  selectUserError
} from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';
import { selectIsAuthenticated } from '../../services/slices/authSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const request = useSelector(selectLoginLoading);
  const error = useSelector(selectUserError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {request ? (
        <Preloader />
      ) : (
        <LoginUI
          errorText={error}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
