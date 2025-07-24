import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2 sm:p-0">
      <div className="w-full max-w-md sm:max-w-lg mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
