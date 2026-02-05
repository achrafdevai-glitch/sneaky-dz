import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/hooks/useProducts";
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
import { CheckCircle, Loader2, Home, Building2, User, Phone, MapPin, Sparkles, Truck, Palette, Ruler, Package, MessageSquare } from "lucide-react";

const orderSchema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(100, "الاسم طويل جداً"),
  phone: z.string().min(10, "رقم الهاتف غير صالح").max(15, "رقم الهاتف غير صالح").regex(/^[0-9]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  wilaya: z.string().min(1, "يرجى اختيار الولاية"),
  commune: z.string().min(1, "يرجى اختيار البلدية"),
  deliveryType: z.enum(["home", "office"]),
  addressDetail: z.string().optional(),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
  selectedShoeSize: z.string().optional(),
  quantity: z.number().min(1).optional(),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  product: Product & { 
    show_quantity?: boolean; 
    show_notes?: boolean; 
    notes?: string | null;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const OrderForm = ({ product, onSuccess, onCancel }: OrderFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const createOrder = useCreateOrder();
  const { data: deliveryPrices } = useDeliveryPrices();
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      deliveryType: "home",
      quantity: 1,
    },
  });

  const selectedWilaya = watch("wilaya");
  const selectedDeliveryType = watch("deliveryType");
  const selectedWilayaData = wilayas.find((w) => w.id === selectedWilaya);
  const selectedWilayaName = selectedWilayaData?.name || "";
  
  // Check if wilaya has office communes
  const hasOfficeCommunes = selectedWilayaName && officeCommunes[selectedWilayaName] && officeCommunes[selectedWilayaName].length > 0;
  const showOfficeCommuneSelector = selectedDeliveryType === "office" && hasOfficeCommunes;

  useEffect(() => {
    if (selectedWilayaName && selectedDeliveryType && deliveryPrices) {
      const price = getDeliveryPrice(deliveryPrices, selectedWilayaName, selectedDeliveryType as "home" | "office");
      setDeliveryPrice(price);
    }
  }, [selectedWilayaName, selectedDeliveryType, deliveryPrices]);

  const onSubmit = async (data: OrderFormData) => {
    try {
      await createOrder.mutateAsync({
        product_id: product.id,
        product_name: product.name,
        customer_name: data.customerName.trim(),
        phone: data.phone.trim(),
        wilaya: wilayas.find((w) => w.id === data.wilaya)?.name || data.wilaya,
        commune: selectedWilayaData?.communes.find((c) => c.id === data.commune)?.name || data.commune,
        delivery_type: data.deliveryType,
        delivery_price: deliveryPrice,
        total_price: (product.new_price * quantity) + deliveryPrice,
        selected_size: data.selectedSize || null,
        selected_color: data.selectedColor || null,
        selected_shoe_size: data.selectedShoeSize || null,
        address_detail: data.addressDetail || null,
        quantity: quantity,
        notes: data.notes || null,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      // Error handled by react-query
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl"
        >
          <CheckCircle className="w-14 h-14 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            تم استلام طلبك بنجاح!
          </h3>
          <p className="text-muted-foreground">
            سنتواصل معك قريباً لتأكيد الطلب
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2 text-gold"
        >
          <Sparkles className="w-5 h-5" />
          <Sparkles className="w-5 h-5" />
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Customer Name */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <Label htmlFor="customerName" className="flex items-center gap-2 text-sm font-medium">
          <User className="w-4 h-4 text-gold" />
          الاسم واللقب
        </Label>
        <Input
          id="customerName"
          placeholder="أدخل اسمك الكامل"
          className="h-12 rounded-xl border-border/50 focus:border-gold bg-secondary/30"
          {...register("customerName")}
        />
        <AnimatePresence>
          {errors.customerName && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-destructive text-sm"
            >
              {errors.customerName.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Phone */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
          <Phone className="w-4 h-4 text-gold" />
          رقم الهاتف
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0XXX XXX XXX"
          className="h-12 rounded-xl border-border/50 focus:border-gold bg-secondary/30"
          {...register("phone")}
        />
        <AnimatePresence>
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-destructive text-sm"
            >
              {errors.phone.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quantity Selection */}
      {product.show_quantity && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-2"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Package className="w-4 h-4 text-gold" />
            الكمية
          </Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </motion.div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Ruler className="w-4 h-4 text-gold" />
            المقاس
          </Label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setValue("selectedSize", size)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  watch("selectedSize") === size
                    ? "bg-gold text-black border-gold"
                    : "border-border hover:border-gold/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Shoe Size Selection */}
      {product.shoe_sizes && product.shoe_sizes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Ruler className="w-4 h-4 text-gold" />
            مقاس الحذاء
          </Label>
          <div className="flex flex-wrap gap-2">
            {product.shoe_sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setValue("selectedShoeSize", size)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  watch("selectedShoeSize") === size
                    ? "bg-gold text-black border-gold"
                    : "border-border hover:border-gold/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Palette className="w-4 h-4 text-gold" />
            اللون
          </Label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue("selectedColor", color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  watch("selectedColor") === color
                    ? "border-gold ring-2 ring-gold ring-offset-2 ring-offset-background"
                    : "border-border hover:border-gold/50"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Wilaya */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="w-4 h-4 text-gold" />
          الولاية
        </Label>
        <Select
          onValueChange={(value) => {
            setValue("wilaya", value);
            setValue("commune", "");
            setValue("addressDetail", "");
          }}
        >
          <SelectTrigger className="h-12 rounded-xl border-border/50 focus:border-gold bg-secondary/30">
            <SelectValue placeholder="اختر الولاية" />
          </SelectTrigger>
          <SelectContent className="rounded-xl max-h-60">
            {wilayas.map((wilaya) => (
              <SelectItem key={wilaya.id} value={wilaya.id} className="rounded-lg">
                {wilaya.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AnimatePresence>
          {errors.wilaya && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-destructive text-sm"
            >
              {errors.wilaya.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Commune */}
      <AnimatePresence>
        {selectedWilaya && selectedWilayaData && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-gold" />
              البلدية
            </Label>
            <Select onValueChange={(value) => setValue("commune", value)}>
              <SelectTrigger className="h-12 rounded-xl border-border/50 focus:border-gold bg-secondary/30">
                <SelectValue placeholder="اختر البلدية" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {selectedWilayaData.communes.map((commune) => (
                  <SelectItem key={commune.id} value={commune.id} className="rounded-lg">
                    {commune.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AnimatePresence>
              {errors.commune && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-destructive text-sm"
                >
                  {errors.commune.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delivery Type */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <Label className="text-sm font-medium">نوع التوصيل</Label>
        <RadioGroup
          defaultValue="home"
          onValueChange={(value) =>
            setValue("deliveryType", value as "home" | "office")
          }
          className="grid grid-cols-2 gap-4"
        >
          <div className="relative">
            <RadioGroupItem
              value="home"
              id="home"
              className="peer sr-only"
            />
            <Label
              htmlFor="home"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-secondary/30 p-4 hover:bg-secondary/50 peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 cursor-pointer transition-all"
            >
              <Home className="mb-2 h-6 w-6 text-gold" />
              <span className="text-sm font-medium">إلى المنزل</span>
            </Label>
          </div>
          <div className="relative">
            <RadioGroupItem
              value="office"
              id="office"
              className="peer sr-only"
            />
            <Label
              htmlFor="office"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-secondary/30 p-4 hover:bg-secondary/50 peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 cursor-pointer transition-all"
            >
              <Building2 className="mb-2 h-6 w-6 text-gold" />
              <span className="text-sm font-medium">إلى المكتب</span>
            </Label>
          </div>
        </RadioGroup>
      </motion.div>

      {/* Office Commune Selection - Shows when "office" is selected and wilaya has branches */}
      <AnimatePresence>
        {showOfficeCommuneSelector && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Truck className="w-4 h-4 text-gold" />
              فرع المكتب
            </Label>
            <Select onValueChange={(value) => setValue("addressDetail", value)}>
              <SelectTrigger className="h-12 rounded-xl border-border/50 focus:border-gold bg-secondary/30">
                <SelectValue placeholder="اختر فرع المكتب" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {officeCommunes[selectedWilayaName].map((commune) => (
                  <SelectItem key={commune} value={commune} className="rounded-lg">
                    {commune}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Notes Display */}
      {product.show_notes && product.notes && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="p-4 rounded-xl bg-gold/10 border border-gold/20"
        >
          <div className="flex items-start gap-2">
            <MessageSquare className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gold mb-1">ملاحظة من المتجر:</p>
              <p className="text-sm text-muted-foreground">{product.notes}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Customer Notes */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.38 }}
        className="space-y-2"
      >
        <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="w-4 h-4 text-gold" />
          ملاحظاتك (اختياري)
        </Label>
        <Textarea
          id="notes"
          placeholder="أضف أي ملاحظات خاصة بطلبك..."
          className="rounded-xl border-border/50 focus:border-gold bg-secondary/30 min-h-[80px]"
          {...register("notes")}
        />
      </motion.div>

      {/* Price Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border-t border-border/50 pt-5 space-y-3"
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">سعر المنتج:</span>
          <span className="font-medium">{product.new_price.toLocaleString()} د.ج</span>
        </div>
        {product.show_quantity && quantity > 1 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">الكمية:</span>
            <span className="font-medium">x{quantity}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">سعر التوصيل:</span>
          <span className="font-medium">{deliveryPrice.toLocaleString()} د.ج</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-border/30">
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            المجموع:
          </span>
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            {((product.new_price * quantity) + deliveryPrice).toLocaleString()} د.ج
          </span>
        </div>
      </motion.div>

      {/* Submit Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 pt-2"
      >
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={createOrder.isPending}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:opacity-90"
        >
          {createOrder.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 ml-2" />
              تأكيد الطلب
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default OrderForm;
