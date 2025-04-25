"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type OrderStatus = "ordered" | "preparing" | "ready" | "delivered" | "paid"
type UserRole = "chef" | "waiter" | "admin"

interface OrderDetailsProps {
  order: any
  onUpdateStatus: (status: OrderStatus) => void
  onUpdatePayment: (isPaid: boolean) => void
  userRole: UserRole
}

export default function OrderDetails({ order, onUpdateStatus, onUpdatePayment, userRole }: OrderDetailsProps) {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-blue-500"
      case "preparing":
        return "bg-yellow-500"
      case "ready":
        return "bg-green-500"
      case "delivered":
        return "bg-purple-500"
      case "paid":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get next available status based on current status and role
  const getNextStatus = () => {
    const { status } = order

    switch (userRole) {
      case "chef":
        if (status === "ordered") return "preparing"
        if (status === "preparing") return "ready"
        return null

      case "waiter":
        if (status === "ready") return "delivered"
        return null

      case "admin":
        if (status === "ordered") return "preparing"
        if (status === "preparing") return "ready"
        if (status === "ready") return "delivered"
        return null

      default:
        return null
    }
  }

  const nextStatus = getNextStatus()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Order #{order._id.substring(order._id.length - 6)}</h3>
          <Badge className={cn("text-white", getStatusColor(order.status))}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium mb-2">Items</h4>
        <ul className="space-y-2">
          {order.items.map((item: any, index: number) => (
            <li key={index} className="flex justify-between">
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>₹{item.totalPrice.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>-₹{order.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Fee</span>
          <span>₹{order.serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>₹{order.deliveryFee.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Payment Status</span>
          <Badge variant={order.paymentStatus ? "default" : "outline"}>{order.paymentStatus ? "Paid" : "Unpaid"}</Badge>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="font-medium">Actions</h4>

        {/* Status update button */}
        {nextStatus && (
          <Button className="w-full" onClick={() => onUpdateStatus(nextStatus as OrderStatus)}>
            Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
          </Button>
        )}

        {/* Payment button - only for waiters and admins when order is delivered */}
        {(userRole === "waiter" || userRole === "admin") && order.status === "delivered" && !order.paymentStatus && (
          <Button className="w-full" variant="outline" onClick={() => onUpdatePayment(true)}>
            Mark as Paid
          </Button>
        )}

        {/* No actions available message */}
        {!nextStatus &&
          !(
            (userRole === "waiter" || userRole === "admin") &&
            order.status === "delivered" &&
            !order.paymentStatus
          ) && <p className="text-sm text-muted-foreground text-center">No actions available for this order</p>}
      </div>
    </div>
  )
}
