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
import { cn } from "@/lib/utils"

import OrderDetails from "@/components/order-details"

import { orders as initialOrders } from "@/data/orders"
import { getUserRole } from "@/Services/CheckRole"

// Import Dialog components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type OrderStatus = "ordered" | "preparing" | "ready" | "delivered" | "paid"
type UserRole = "chef" | "waiter" | "admin"

export default function OrderDashboard() {
  const [orders, setOrders] = useState(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState(initialOrders)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orderRoute/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  useEffect(() => {
    if (orders.length < 2) {
      fetchOrders()
    }
  }, [])

  useEffect(() => {
    const role = getUserRole(); // e.g., returns string | null
  
    if (role === "chef" || role === "waiter" || role === "admin") {
      setUserRole(role);
    } else {
      setUserRole(null); // fallback for invalid or undefined roles
    }
  }, []);
  

  useEffect(() => {
    let filtered = [...orders]

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

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

  const resetFilters = () => {
    setStatusFilter("all")
    setDateFilter(undefined)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered": return "bg-blue-500"
      case "preparing": return "bg-yellow-500"
      case "ready": return "bg-green-500"
      case "delivered": return "bg-purple-500"
      case "paid": return "bg-emerald-500"
      default: return "bg-gray-500"
    }
  }

  const RoleBasedOrders = filteredOrders.filter((order) => {
    switch (userRole) {
      case "chef":
        return order.status === "ordered" || order.status === "preparing"
      case "waiter":
        return order.status === "ready" || order.status === "delivered"
      case "admin":
        return true
      default:
        return false
    }
  })

  // Ensure userRole is set to a valid UserRole before passing it
const validUserRole = userRole ?? ""; 

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">View and manage restaurant orders</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Orders</CardTitle>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
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
                  <Button variant="outline" className={cn("w-[240px] justify-start text-left", !dateFilter && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {/* <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} /> */}
                </PopoverContent>
              </Popover>
            </div>

            <div className="overflow-y-auto max-h-[400px]"> {/* Vertical scroll only */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RoleBasedOrders.map((order) => (
                    <TableRow key={order._id}  onClick={() => setSelectedOrder(order)}>
                      <TableCell>{order._id.slice(-6)}</TableCell>
                      <TableCell>{order.items.map((item: any) => item.name).join(", ")}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(order.createdAt), "PPpp")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Popup Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <OrderDetails order={selectedOrder} userRole={validUserRole} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
