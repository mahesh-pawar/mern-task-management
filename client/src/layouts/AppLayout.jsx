import { Outlet } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';

function AppLayout() {
  return (
    <div className="min-h-full">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
