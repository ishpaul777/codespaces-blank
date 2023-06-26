import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { SidebarAlt } from './sidebarAlt';
import { ToastContainer } from 'react-toastify';
import useDarkMode from '../../hooks/useDarkMode';
import DarkMode from '../buttons/DarkMode';

export default function Layout() {
  const { darkMode } = useDarkMode();
  return (
    <div className="flex flex-row h-screen w-full">
      <Sidebar />
      <main
        className={`w-5/6 max-h-screen overflow-y-auto ${
          darkMode && 'bg-background-secondary-alt'
        }`}
      >
        <Outlet></Outlet>
      </main>
      <ToastContainer />
      <DarkMode />
    </div>
  );
}
