import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder } from "@/hooks/useOrders";
import { useDeliveryPrices, getDeliveryPrice } from "@/hooks/useDeliveryPrices";
import { wilayas, officeCommunes } from "@/data/wilayas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Home, Loader2, MapPin, MessageSquare, Phone, Sparkles, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { parseOrderError } from "@/lib/orderErrors";

const schema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(100, "الاسم طويل جداً"),
  phone: z
    .string()
    .min(10, "رقم الهاتف غير صالح")
    .max(15, "رقم الهاتف غير صالح")
    .regex(/^[0-9]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  wilaya: z.string().min(1, "يرجى اختيار الولاية"),
  commune: z.string().min(1, "يرجى اختيار البلدية"),
  deliveryType: z.enum(["home", "office"]),
  addressDetail: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface CartCheckoutFormProps {
  onCancel: () => void;
  onSuccess: (customerName: string) => void;
}

const CartCheckoutForm = ({ onCancel, onSuccess }: CartCheckoutFormProps) => {
  const { items, subtotal, clear, removeItem } = useCart();
  const createOrder = useCreateOrder();
  const { data: deliveryPrices } = useDeliveryPrices();
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryType: "home" },
  });

  const selectedWilaya = watch("wilaya");
  const deliveryType = watch("deliveryType");
  const wilayaData = wilayas.find((w) => w.id === selectedWilaya);
  const wilayaName = wilayaData?.name || "";
  const showOfficeCommunes =
    deliveryType === "office" && !!wilayaName && (officeCommunes[wilayaName]?.length || 0) > 0;

  useEffect(() => {
    if (wilayaName && deliveryType && deliveryPrices) {
      setDeliveryPrice(getDeliveryPrice(deliveryPrices, wilayaName, deliveryType));
    }
  }, [wilayaName, deliveryType, deliveryPrices]);

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setSubmitting(true);
    const communeName = wilayaData?.communes.find((c) => c.id === data.commune)?.name || data.commune;
    let placed = 0;

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const shipping = i === 0 ? deliveryPrice : 0;
        try {
          await createOrder.mutateAsync({
            product_id: item.productId,
            product_name: item.name,
            customer_name: data.customerName.trim(),
            phone: data.phone.trim(),
            wilaya: wilayaName || data.wilaya,
            commune: communeName,
            delivery_type: data.deliveryType,
            delivery_price: shipping,
            total_price: item.unitPrice * item.quantity + shipping,
            selected_size: item.size,
            selected_color: item.color,
            selected_shoe_size: item.shoeSize,
            address_detail: data.addressDetail || null,
            quantity: item.quantity,
            notes: data.notes?.trim() || null,
          });
          placed += 1;
          removeItem(item.key);
        } catch (error) {
          toast.error(`${item.name}: ${parseOrderError(error)}`);
        }
      }

      if (placed > 0) {
        toast.success("تم استلام طلبك بنجاح");
        if (placed === items.length) clear();
        onSuccess(data.customerName.trim());
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
      <div className="space-y-2">
        <Label htmlFor="cart-name" className="flex items-center gap-2 text-sm font-medium">
          <User className="w-4 h-4 text-gold" />
          الاسم واللقب
        </Label>
        <Input id="cart-name" placeholder="أدخل اسمك الكامل" className="h-12 rounded-xl bg-secondary/30" {...register("customerName")} />
        {errors.customerName && <p className="text-destructive text-sm">{errors.customerName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cart-phone" className="flex items-center gap-2 text-sm font-medium">
          <Phone className="w-4 h-4 text-gold" />
          رقم الهاتف
        </Label>
        <Input id="cart-phone" type="tel" placeholder="0XXX XXX XXX" className="h-12 rounded-xl bg-secondary/30" {...register("phone")} />
        {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="w-4 h-4 text-gold" />
          الولاية
        </Label>
        <Select
          onValueChange={(v) => {
            setValue("wilaya", v, { shouldValidate: true });
            setValue("commune", "");
            setValue("addressDetail", "");
          }}
        >
          <SelectTrigger className="h-12 rounded-xl bg-secondary/30">
            <SelectValue placeholder="اختر الولاية" />
          </SelectTrigger>
          <SelectContent className="rounded-xl max-h-60">
            {wilayas.map((w) => (
              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.wilaya && <p className="text-destructive text-sm">{errors.wilaya.message}</p>}
      </div>

      {wilayaData && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-gold" />
            البلدية
          </Label>
          <Select onValueChange={(v) => setValue("commune", v, { shouldValidate: true })}>
            <SelectTrigger className="h-12 rounded-xl bg-secondary/30">
              <SelectValue placeholder="اختر البلدية" />
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-60">
              {wilayaData.communes.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.commune && <p className="text-destructive text-sm">{errors.commune.message}</p>}
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-sm font-medium">نوع التوصيل</Label>
        <RadioGroup
          defaultValue="home"
          onValueChange={(v) => setValue("deliveryType", v as "home" | "office")}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="home" id="cart-home" className="peer sr-only" />
            <Label htmlFor="cart-home" className="flex flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-secondary/30 p-4 peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 cursor-pointer transition-all">
              <Home className="mb-2 h-6 w-6 text-gold" />
              <span className="text-sm font-medium">إلى المنزل</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="office" id="cart-office" className="peer sr-only" />
            <Label htmlFor="cart-office" className="flex flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-secondary/30 p-4 peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 cursor-pointer transition-all">
              <Building2 className="mb-2 h-6 w-6 text-gold" />
              <span className="text-sm font-medium">إلى المكتب</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {showOfficeCommunes && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Truck className="w-4 h-4 text-gold" />
            فرع المكتب
          </Label>
          <Select onValueChange={(v) => setValue("addressDetail", v)}>
            <SelectTrigger className="h-12 rounded-xl bg-secondary/30">
              <SelectValue placeholder="اختر فرع المكتب" />
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-60">
              {officeCommunes[wilayaName].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="cart-notes" className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="w-4 h-4 text-gold" />
          ملاحظاتك (اختياري)
        </Label>
        <Textarea id="cart-notes" className="rounded-xl bg-secondary/30 min-h-20" {...register("notes")} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/50 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">مجموع المنتجات:</span>
          <span className="font-medium">{subtotal.toLocaleString()} د.ج</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">سعر التوصيل:</span>
          <span className="font-medium">{deliveryPrice.toLocaleString()} د.ج</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/30">
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">المجموع:</span>
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            {(subtotal + deliveryPrice).toLocaleString()} د.ج
          </span>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={onCancel} disabled={submitting}>
          رجوع
        </Button>
        <Button
          type="submit"
          disabled={submitting || items.length === 0}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:opacity-90"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (<><Sparkles className="h-4 w-4 ml-2" />تأكيد الطلب</>)}
        </Button>
      </div>
    </form>
  );
};

export default CartCheckoutForm;
