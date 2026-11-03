import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '../features/auth/useAuth';
import { PageLoader } from '../components/common/Spinner';

// Login/register pages: an already authenticated user is sent to the dashboard.
function GuestRoute() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <PageLoader />;
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
