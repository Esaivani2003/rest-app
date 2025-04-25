
import React, { useEffect, useState } from 'react';

import StaffLayout from '@/components/layout/StaffLayout';
import OrderCard from '@/components/staff/OrderCard';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StaffOrdersPage = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await orderApi.getOrders();
        setOrders(ordersData);
      } catch (error) {
        toast.error('Failed to load orders');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // In a real app, set up a websocket or polling for real-time updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      toast.success(`Order #${orderId.slice(0, 8)} status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };
  
  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING);
  const preparingOrders = orders.filter(order => order.status === OrderStatus.PREPARING);
  const readyOrders = orders.filter(order => order.status === OrderStatus.READY);
  const servedOrders = orders.filter(order => order.status === OrderStatus.SERVED);
  
  if (loading) {
    return (
      <StaffLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-restaurant-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading orders...</p>
          </div>
        </div>
      </StaffLayout>
    );
  }
  
  return (
    <StaffLayout>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="all">
            All ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Preparing ({preparingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready ({readyOrders.length})
          </TabsTrigger>
          <TabsTrigger value="served">
            Served ({servedOrders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending orders</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preparing">
          {preparingOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders being prepared</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preparingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ready">
          {readyOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders ready for serving</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="served">
          {servedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No served orders</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servedOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </StaffLayout>
  );
};

export default StaffOrdersPage;
