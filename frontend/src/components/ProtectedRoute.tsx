import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const isAuthStorage = localStorage.getItem('isAuthenticated') === 'true';
  const reduxAuth = useSelector(
    (state: RootState) => state.auth.isAuthenticated || Boolean(state.auth.token)
  );

  const isAuthenticated = isAuthStorage || Boolean(token) || reduxAuth;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
