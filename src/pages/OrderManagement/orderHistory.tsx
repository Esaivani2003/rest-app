import OrderDashboard from "@/components/order-history"
import Layout from "@/components/layout"

export default function Home() {
  // In a real app, you would check authentication here
  // If not authenticated, redirect to login
  // const isAuthenticated = checkAuth();
  // if (!isAuthenticated) return redirect('/login');
 
  return (
  <Layout>
  <OrderDashboard />
  </Layout>
  )
}
