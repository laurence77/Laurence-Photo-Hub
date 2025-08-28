import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type Props = { children: JSX.Element };

const RequireAuth = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Send user to admin login portal when hitting protected routes
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;

