
import React from 'react';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Clock, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
  const statusColors = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.PREPARING]: "bg-blue-100 text-blue-800",
    [OrderStatus.READY]: "bg-green-100 text-green-800",
    [OrderStatus.SERVED]: "bg-gray-100 text-gray-800",
  };
  
  const getNextStatus = () => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return OrderStatus.PREPARING;
      case OrderStatus.PREPARING:
        return OrderStatus.READY;
      case OrderStatus.READY:
        return OrderStatus.SERVED;
      default:
        return null;
    }
  };
  
  const nextStatus = getNextStatus();
  const nextStatusLabels = {
    [OrderStatus.PREPARING]: "Mark as Preparing",
    [OrderStatus.READY]: "Mark as Ready",
    [OrderStatus.SERVED]: "Mark as Served",
  };
  
  const total = order.orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity, 
    0
  );
  
  const formattedDate = new Date(order.createdAt).toLocaleString();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Table #{order.tableNumber}</h3>
            <Badge className={statusColors[order.status]}>{order.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formattedDate}
          </p>
        </div>
        <div className="font-medium">${total.toFixed(2)}</div>
      </CardHeader>
      
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="items">
            <AccordionTrigger>
              <span className="text-sm font-medium">
                {order.orderItems.length} items
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x</span> {item.menuItem.name}
                      {item.notes && (
                        <p className="text-xs text-gray-500 italic">{item.notes}</p>
                      )}
                    </div>
                    <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {nextStatus && (
          <Button 
            onClick={() => onStatusChange(order.id, nextStatus)}
            className="w-full mt-4 bg-restaurant-secondary hover:bg-restaurant-secondary/90"
          >
            <Check className="h-4 w-4 mr-2" /> {nextStatusLabels[nextStatus]}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
