import React, { ReactNode,useEffect, useState } from 'react';
import Link from 'next/link';
import {isAuthenticated} from "@/Services/CheckRole"
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [authStatus, setAuthStatus] = useState<boolean>(false);

  // Check authentication status on component mount
  useEffect(() => {
    const authenticated = isAuthenticated();
    setAuthStatus(authenticated); // Update the state based on authentication
  }, []);


  return (
    <div className= {`  min-h-screen flex flex-col bg-gray-100`}>
      {/* Navbar */}
      <nav className="bg-black shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl text-white font-bold">🍴 My Restaurant</h1>

        {/* Hamburger Icon */}
        <button className={` ${!authStatus && "hidden"} lg:hidden text-white text-2xl`} onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* Desktop Nav Links */}
        <div className="flex space-x-4 text-white">
          <Link href="/food-order">Orders</Link>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        {isOpen && (
          <aside className= {`${!authStatus && "hidden"} fixed top-0 left-0 w-64 h-full bg-amber-800 text-black p-4  z-50`}>
            <button className="text-white text-2xl mb-4" onClick={() => setIsOpen(false)}>✕</button>
            <nav>
              <ul>
                <li className="p-4 hover:bg-white transition">
                  <Link href="/Menus">Menu</Link>
                </li>
                <li className="p-4 hover:bg-white transition">
                  <Link href="/food-order">Order Management</Link>
                </li>
                <li className="p-4 hover:bg-white transition">
                  <Link href="/Employee">Employee Management</Link>
                </li>
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex overflow-auto w-full">
        <aside className= {` ${!authStatus && "hidden"} flex w-64 h-full bg-amber-800 text-black  z-50"`}>
            {/* <button className="text-white text-2xl mb-4" onClick={() => setIsOpen(false)}>✕</button> */}
            <nav>
              <ul>
                <li className="p-4 hover:bg-white transition">
                  <Link href="/Menus">Menu</Link>
                </li>
                <li className="p-4 hover:bg-white transition">
                  <Link href="/food-order">Order Management</Link>
                </li>
                <li className="p-4 hover:bg-white transition">
                  <Link href="/Employee">Employee Management</Link>
                </li>
              </ul>
            </nav>
          </aside>
          <div className=' px-3 w-full'>
          {children}
          </div>
         
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white p-6 w-full text-center">
        <p>&copy; 2025 My Restaurant. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
