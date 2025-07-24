import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useState } from 'react';
import logo from '../assets/logo.svg';
import full from '../assets/full.png';
import small from '../assets/small.jpg';

export default function Sidebar() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile top bar with logo and menu icon */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-between px-4 z-50 shadow">
        <img src={small} alt="Logo" className="h-8 w-8 drop-shadow-lg" />
        <button
          className="p-2 rounded focus:outline-none hover:bg-indigo-100/30 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open sidebar"
        >
          {/* Hamburger icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-blue-50 via-white to-purple-50 shadow-xl h-screen min-h-screen p-3 sm:p-4 w-64 fixed sm:static top-0 left-0 z-40 flex flex-col items-center sm:items-stretch transform transition-transform duration-200 ease-in-out pt-16 sm:pt-0
        ${open ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
      >
        {/* Logo section (desktop only) */}
        <div className="hidden sm:flex items-center justify-center mb-8 mt-2">
          <img src={full} alt="Logo" className="h-20 w-100 mr-2 drop-shadow-lg" />
          {/* <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-wide">Task Manager</span> */}
        </div>
        {/* Logo section (mobile, inside sidebar) */}
        <div className="sm:hidden flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="h-10 w-10 drop-shadow-lg" />
        </div>
        <nav className="space-y-2 w-full">
          <Link
            to="/dashboard"
            className="block text-base sm:text-lg px-2 py-2 rounded font-semibold text-blue-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 transition"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className="block text-base sm:text-lg px-2 py-2 rounded font-semibold text-indigo-700 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 transition"
            onClick={() => setOpen(false)}
          >
            Tasks
          </Link>
          {/* {user?.role === 'admin' && (
            <Link to="/assign" className="block text-gray-700 hover:text-black">Assign Tasks</Link>
          )} */}
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="mt-4 text-base sm:text-lg px-2 py-2 w-full text-left rounded font-semibold bg-gradient-to-r from-rose-500 to-rose-400 text-white hover:from-rose-600 hover:to-rose-500 shadow hover:shadow-lg transition"
          >
            Logout
          </button>
        </nav>
        {/* Close button for mobile */}
        <button
          className="sm:hidden absolute top-4 right-4 text-rose-500 hover:text-rose-700 bg-white bg-opacity-80 rounded-full p-1 shadow"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          {/* Close icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
