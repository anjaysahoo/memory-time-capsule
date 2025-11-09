import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Open from './pages/Open';
import ComponentTest from './pages/ComponentTest';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'create',
        element: <Create />,
      },
      {
        path: 'open',
        element: <Open />,
      },
      {
        path: 'test',
        element: <ComponentTest />,
      },
    ],
  },
]);

