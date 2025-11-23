import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('heallk_token');
  
  if (!isAuthenticated) {
     return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;