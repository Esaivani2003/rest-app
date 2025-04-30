import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import {
  isAuthenticated,
  isAdmin,
  isChef,
  isWaiter,
  getUserInfo,
} from "@/Services/CheckRole";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string | null; role: string | null }>({
    name: null,
    role: null,
  });

  useEffect(() => {
    const authenticated = isAuthenticated();
    setAuthStatus(authenticated);

    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  const navItems = [
    { href: '/Menus', label: 'Menu' },
    { href: '/OrderManagement', label: 'Order Management' },
    { href: '/Employee', label: 'Employee Management' },
  ];

  const PermittedRoutes = isAdmin()
    ? navItems
    : navItems.filter((filt) => filt.label === "Order Management");

  const isActive = (href: string) => router.pathname === href;

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-black shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl text-white font-bold">🍴 My Restaurant</h1>
        <button
          className={`${!authStatus && "hidden"} lg:hidden text-white text-2xl`}
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <div className="flex items-center space-x-4 text-white relative">
          {/* Show Orders button for all authenticated users */}
          {!authStatus && (
            <Link href="/food-order">Orders</Link>
          )}

          {authStatus && (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowProfileDropdown((prev) => !prev)}
              >
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className="text-white font-medium">
                  {userInfo.name || 'User'}
                </span>
              </div>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded-xl shadow-lg w-60 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{userInfo.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{userInfo.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfileDropdown(false)}
                      className="text-gray-500 hover:text-black text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition duration-150 border-t mt-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        {isOpen && (
          <aside className={`${!authStatus && "hidden"} fixed top-0 left-0 w-64 h-full bg-amber-800 text-black p-4 z-50`}>
            <button className="text-white text-2xl mb-4" onClick={() => setIsOpen(false)}>✕</button>
            <nav>
              <ul>
                {PermittedRoutes.map((item) => (
                  <li key={item.href} className={`p-2 transition rounded-xs ${isActive(item.href) ? 'bg-white text-black' : 'hover:bg-white'}`}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content with Sidebar */}
        <main className="flex overflow-auto w-full">
          <aside className={`${!authStatus && "hidden"} w-[20%] pt-2 h-full bg-black text-black z-50`}>
            <nav className="p-2">
              <ul className='space-y-2'>
                {PermittedRoutes.map((item) => (
                  <li key={item.href} className={`p-2 rounded-[7px] transition ${isActive(item.href) ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="px-3 w-full">
            {children}
          </div>
        </main>
      </div>

      <footer className="bg-black text-white p-6 w-full text-center">
        <p>&copy; 2025 My Restaurant. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
