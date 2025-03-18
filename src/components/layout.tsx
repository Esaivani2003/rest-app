import React, { ReactNode } from 'react';  
import Link from 'next/link';  
import Image from 'next/image';  
import Button from "./ui/button";  

// ✅ Add children prop type
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {  
  return (  
    <div className="h-screen bg-gray-100"> 

      {/* Navbar */}  
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">  
        <h1 className="text-2xl font-bold">🍴 My Restaurant</h1>  
        <div className="space-x-4">  
          {/*<Link href="/">Home</Link>*/}  
          {/*<Link href="/menu">Menu</Link> */}
          {/*<Link href="/reservations">Reservations</Link> */}
          {/*<Link href="/orders">Orders</Link> */}
        </div>  
      </nav>  
      {/* Sidebar Section */}

      <div className=' flex h-full'>
     <aside className="w-64 bg-gray-800 h-full text-white flex flex-col">
       {/* <div className="p-6 text-2xl font-bold">🍴 Restaurant App</div>*/}
        <nav className="flex-1">
          <ul>
            <li className="p-4 hover:bg-gray-700 transition">
              <Link href="/food-management">Food Management</Link>
            </li>
            <li className="p-4 hover:bg-gray-700 transition">
              <Link href="/order-management">Order Management</Link>
            </li>
            <li className="p-4 hover:bg-gray-700 transition">
              <Link href="/employee-management">Employee Management</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Render children here */}
      <main className=' h-screen w-full'>{children}</main>  
      </div>
      {/* Footer */}  
      <footer className="bg-gray-800 text-white p-6 text-center">  
        <p>&copy; 2025 My Restaurant. All Rights Reserved.</p>  
      </footer>  
    </div>  
  );  
};  

export default Layout;  
