import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import DefaultLayout from '../layouts/DefaultLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
// import TaskList from '../pages/tasks/TaskList';
import TaskDetail from '../pages/tasks/Tasks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: '', element: <Login /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'tasks', element: <TaskDetail /> },
      // { path: 'tasks/:id', element: <TaskDetail /> },
    ],
  },
]);

export default router;
