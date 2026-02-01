import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
import { wilayas } from "@/data/wilayas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2, Home, Building2 } from "lucide-react";

const orderSchema = z.object({
  customerName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  wilaya: z.string().min(1, "يرجى اختيار الولاية"),
  commune: z.string().min(1, "يرجى اختيار البلدية"),
  deliveryType: z.enum(["home", "office"]),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const OrderForm = ({ product, onSuccess, onCancel }: OrderFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const createOrder = useCreateOrder();

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
    },
  });

  const selectedWilaya = watch("wilaya");
  const selectedWilayaData = wilayas.find((w) => w.id === selectedWilaya);

  const onSubmit = async (data: OrderFormData) => {
    try {
      await createOrder.mutateAsync({
        product_id: product.id,
        product_name: product.name,
        customer_name: data.customerName,
        phone: data.phone,
        wilaya: wilayas.find((w) => w.id === data.wilaya)?.name || data.wilaya,
        commune:
          selectedWilayaData?.communes.find((c) => c.id === data.commune)
            ?.name || data.commune,
        delivery_type: data.deliveryType,
        total_price: product.new_price,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      console.error("Order error:", error);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
          تم استلام طلبك بنجاح!
        </h3>
        <p className="text-muted-foreground">
          سنتواصل معك قريباً لتأكيد الطلب
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerName">الاسم واللقب</Label>
        <Input
          id="customerName"
          placeholder="أدخل اسمك الكامل"
          {...register("customerName")}
        />
        {errors.customerName && (
          <p className="text-destructive text-sm">{errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0XXX XXX XXX"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-destructive text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>الولاية</Label>
        <Select
          onValueChange={(value) => {
            setValue("wilaya", value);
            setValue("commune", "");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الولاية" />
          </SelectTrigger>
          <SelectContent>
            {wilayas.map((wilaya) => (
              <SelectItem key={wilaya.id} value={wilaya.id}>
                {wilaya.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.wilaya && (
          <p className="text-destructive text-sm">{errors.wilaya.message}</p>
        )}
      </div>

      {selectedWilaya && selectedWilayaData && (
        <div className="space-y-2">
          <Label>البلدية</Label>
          <Select onValueChange={(value) => setValue("commune", value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر البلدية" />
            </SelectTrigger>
            <SelectContent>
              {selectedWilayaData.communes.map((commune) => (
                <SelectItem key={commune.id} value={commune.id}>
                  {commune.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.commune && (
            <p className="text-destructive text-sm">{errors.commune.message}</p>
          )}
        </div>
      )}

      <div className="space-y-3">
        <Label>نوع التوصيل</Label>
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
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
            >
              <Home className="mb-2 h-6 w-6" />
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
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
            >
              <Building2 className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">إلى المكتب</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg">المجموع:</span>
          <span className="text-2xl font-bold text-primary">
            {product.new_price.toLocaleString()} د.ج
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            "تأكيد الطلب"
          )}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
