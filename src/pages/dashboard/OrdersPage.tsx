import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, useUpdateOrderStatus, useDeleteOrder, Order } from "@/hooks/useOrders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Eye, Printer, Package, User, Phone, MapPin, Truck, Calendar, Palette, Ruler } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const statusLabels: Record<Order["status"], string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
};

const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handlePrint = (order: Order) => {
    const printContent = `
      <html dir="rtl">
        <head>
          <title>طلب - ${order.customer_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            .label { font-weight: bold; }
            .footer { margin-top: 30px; border-top: 1px dashed #000; padding-top: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SNEAKY SHOP</h1>
            <p>Dress Than Differently</p>
          </div>
          <div class="info"><span class="label">المنتج:</span> ${order.product_name}</div>
          <div class="info"><span class="label">العميل:</span> ${order.customer_name}</div>
          <div class="info"><span class="label">الهاتف:</span> ${order.phone}</div>
          <div class="info"><span class="label">الولاية:</span> ${order.wilaya}</div>
          <div class="info"><span class="label">البلدية:</span> ${order.commune}</div>
          ${order.address_detail ? `<div class="info"><span class="label">التفاصيل:</span> ${order.address_detail}</div>` : ''}
          <div class="info"><span class="label">التوصيل:</span> ${order.delivery_type === "home" ? "منزل" : "مكتب"}</div>
          ${order.selected_size ? `<div class="info"><span class="label">المقاس:</span> ${order.selected_size}</div>` : ''}
          ${order.selected_shoe_size ? `<div class="info"><span class="label">مقاس الحذاء:</span> ${order.selected_shoe_size}</div>` : ''}
          ${order.selected_color ? `<div class="info"><span class="label">اللون:</span> <span style="background:${order.selected_color};padding:2px 10px;border-radius:4px;">&nbsp;</span></div>` : ''}
          <div class="info"><span class="label">سعر التوصيل:</span> ${order.delivery_price?.toLocaleString() || 0} د.ج</div>
          <div class="info"><span class="label">المجموع:</span> ${order.total_price.toLocaleString()} د.ج</div>
          <div class="footer">
            <p>شكراً لتسوقكم معنا!</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">الطلبات</h2>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الطلبات</h2>

      {!orders || orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg">لا توجد طلبات بعد</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border/50 overflow-hidden hover:border-white/20 transition-all"
              >
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{order.product_name}</h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" />
                        {order.customer_name}
                      </p>
                    </div>
                    <Badge className={`${statusColors[order.status]} text-white shrink-0`}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.wilaya}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      {order.delivery_type === "home" ? "منزل" : "مكتب"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                      {order.total_price.toLocaleString()} د.ج
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(order.created_at), "dd MMM yyyy", { locale: ar })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        updateStatus.mutate({ id: order.id, status: value as Order["status"] })
                      }
                    >
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePrint(order)}>
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteOrder.mutate(order.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المنتج</span>
                  <span className="font-medium">{selectedOrder.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العميل</span>
                  <span>{selectedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الهاتف</span>
                  <span dir="ltr">{selectedOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العنوان</span>
                  <span>{selectedOrder.wilaya} - {selectedOrder.commune}</span>
                </div>
                {selectedOrder.address_detail && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التفاصيل</span>
                    <span>{selectedOrder.address_detail}</span>
                  </div>
                )}
                {selectedOrder.selected_size && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><Ruler className="w-3 h-3" /> المقاس</span>
                    <span>{selectedOrder.selected_size}</span>
                  </div>
                )}
                {selectedOrder.selected_shoe_size && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><Ruler className="w-3 h-3" /> مقاس الحذاء</span>
                    <span>{selectedOrder.selected_shoe_size}</span>
                  </div>
                )}
                {selectedOrder.selected_color && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><Palette className="w-3 h-3" /> اللون</span>
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: selectedOrder.selected_color }} />
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">التوصيل</span>
                  <span>{selectedOrder.delivery_type === "home" ? "منزل" : "مكتب"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">سعر التوصيل</span>
                  <span>{selectedOrder.delivery_price?.toLocaleString() || 0} د.ج</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>المجموع</span>
                  <span className="text-white">{selectedOrder.total_price.toLocaleString()} د.ج</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => handlePrint(selectedOrder)}>
                <Printer className="w-4 h-4 ml-2" />
                طباعة
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
