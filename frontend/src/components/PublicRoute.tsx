import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export const PublicRoute = () => {
  const token = localStorage.getItem('token');
  const isAuthStorage = localStorage.getItem('isAuthenticated') === 'true';
  const reduxAuth = useSelector(
    (state: RootState) => state.auth.isAuthenticated || Boolean(state.auth.token)
  );

  const isAuthenticated = isAuthStorage || Boolean(token) || reduxAuth;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
