import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAuth from '../features/auth/useAuth';
import { PageLoader } from '../components/common/Spinner';

// Waits for session restoration (/auth/me) before deciding, so a refresh
// on a protected page doesn't bounce the user to /login.
function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <PageLoader label="Restoring your session..." />;
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
