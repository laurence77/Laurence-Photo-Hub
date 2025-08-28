import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type Props = { children: JSX.Element; roles?: string[] };

const RequireAuth = ({ children, roles }: Props) => {
  const { isAuthenticated, roles: myRoles } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Send user to admin login portal when hitting protected routes
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  if (roles && roles.length && !roles.some(r => myRoles.includes(r))) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default RequireAuth;
