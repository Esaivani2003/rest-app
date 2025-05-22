"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Filter, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import OrderDetails from "@/components/order-details"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router";
import { toast } from "sonner"



// Mock data - in a real app, this would come from an API
import { orders as initialOrders } from "@/data/orders"
import { getUserRole } from "@/Services/CheckRole"
// Define order status types
type OrderStatus = "ordered" | "preparing" | "ready" | "delivered" | "paid"

// Define user roles
type UserRole = "chef" | "waiter" | "admin"

export default function OrderDashboard() {
  const [orders, setOrders] = useState(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState(initialOrders)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [userRole, setUserRole] = useState<string | null>() // Default to admin for demo
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  const router = useRouter();


  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orderRoute/orders")
      const data = await response.json()
  
      const today = new Date()
      const todayDateOnly = today.toISOString().split("T")[0] // e.g., "2025-04-30"
  
      const filteredOrders = data.filter((order: any) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0]
        return orderDate === todayDateOnly
      })
  
      setOrders(filteredOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }
  

  useEffect(() => {
    if (orders && orders?.length < 2) {
      fetchOrders()
    }
  }, [])

  // Check authentication status on component mount
  useEffect(() => {
    const authenticated = getUserRole();
    setUserRole(authenticated); // Update the state based on authentication
  }, []);

  // Filter orders based on status and date
  useEffect(() => {
    let filtered = [...orders]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        )
      })
    }

    setFilteredOrders(filtered)
  }, [orders, statusFilter, dateFilter])

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)

    // In a real app, you would make an API call here
    // Example: await fetch('/api/orders/${orderId}', { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })

    // If the selected order is being updated, update it too
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }



  // Reset filters
  const resetFilters = () => {
    setStatusFilter("all")
    setDateFilter(undefined)
  }

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

  // Get available actions based on user role and current status
  const getAvailableActions = (order: any) => {
    const { status, paymentStatus } = order

    switch (userRole) {
      case "chef":
        if (status === "ordered") {
          return [{ label: "Preparing", value: "preparing" }]
        } else if (status === "preparing") {
          return [{ label: "Ready", value: "ready" }]
        }
        return []

      case "waiter":
        const actions = []
        if (status === "ready") {
          actions.push({ label: "Delivered", value: "delivered" })
        }
        // if (status === "delivered" && !paymentStatus) {
        //   actions.push({ label: "Mark as Paid", value: "paid" })
        // }
        return actions

      case "admin":
        const adminActions = []
        if (status === "ordered") {
          adminActions.push({ label: "Preparing", value: "preparing" })
        }
        if (status === "preparing") {
          adminActions.push({ label: "Ready", value: "ready" })
        }
        if (status === "ready") {
          adminActions.push({ label: "Delivered", value: "delivered" })
        }
        if (status === "delivered") {
          adminActions.push({ label: "Mark as Paid", value: "paid" })
        }
        return adminActions

      default:
        return []
    }
  }

  // Handle action selection
  const handleActionSelect = async (orderId: string, action: string) => {
    try {
      const orderData = {
        id: orderId, status: action
      };

      const response = await fetch('/api/orderRoute/orderStatusUpdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order failed:', errorData);
        toast.error("Failed to update order status. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Order staus updated successfully:", result);
      toast.success("Order status updated successfully!");
      fetchOrders()

    } catch (e: any) {
      console.error("Error placing order:", e);
      toast.error("Something went wrong while placing the order.");

    }

  }

  // Filter orders based on user role
  const RoleBasedOrders = filteredOrders.filter((order) => {
    switch (userRole) {
      case "chef":
        // Chef can only see 'ordered' or 'preparing' orders
        return order.status === "ordered" || order.status === "preparing";
      case "waiter":
        // Waiter can see 'ready', 'delivered', or 'paid' orders
        return order.status === "ready" || order.status === "delivered";
      case "admin":
        // Admin can see all orders
        return order.status === "delivered" || order.status === "paid";;
      default:
        return false;
    }
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground">View and manage restaurant orders</p>
          </div>

          {/* Role Selector - In a real app, this would be determined by authentication */}
          {/* <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chef">Chef</SelectItem>
              <SelectItem value="waiter">Waiter</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">Orders</CardTitle>
              <div className="flex items-center gap-2">
                {/* <Button variant="outline" size="sm" onClick={resetFilters}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button> */}
                {userRole === "admin" && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => router.push("/OrderManagement/orderHistory")}
  >
    <RefreshCcw className="h-4 w-4 mr-2" />
    History
  </Button>
)}

              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                  </PopoverContent>
                </Popover>
              </div> */}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RoleBasedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      RoleBasedOrders.map((order) => (
                        <TableRow
                          key={order._id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <TableCell className="font-medium">{order._id.substring(order._id.length - 6)}</TableCell>
                          <TableCell>{format(new Date(order.createdAt), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-white", getStatusColor(order.status))}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            {/* {order.paymentStatus && <Badge className="ml-2 bg-green-500 text-white">Paid</Badge>} */}
                          </TableCell>
                          <TableCell>
                            {getAvailableActions(order).length > 0 ? (
                              <Select onValueChange={(value) => handleActionSelect(order._id, value)} value="">
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableActions(order).map((action) => (
                                    <SelectItem key={action.value} value={action.value}>
                                      {action.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-sm text-muted-foreground">No actions</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedOrder ? (
                <OrderDetails
                order={selectedOrder}
                userRole={userRole as UserRole}
              />
              
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <p className="text-muted-foreground">Select an order to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
