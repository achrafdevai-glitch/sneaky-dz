import { useState } from "react";
import { useDeliveryPrices } from "@/hooks/useDeliveryPrices";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const DeliveryPricesPage = () => {
  const { data: prices, isLoading, refetch } = useDeliveryPrices();
  const [editedPrices, setEditedPrices] = useState<Record<string, { home: number; office: number }>>({});
  const [saving, setSaving] = useState(false);

  const handlePriceChange = (wilaya: string, type: "home" | "office", value: string) => {
    const numValue = parseInt(value) || 0;
    setEditedPrices((prev) => ({
      ...prev,
      [wilaya]: {
        home: type === "home" ? numValue : (prev[wilaya]?.home ?? prices?.find(p => p.wilaya === wilaya)?.home_price ?? 0),
        office: type === "office" ? numValue : (prev[wilaya]?.office ?? prices?.find(p => p.wilaya === wilaya)?.office_price ?? 0),
      },
    }));
  };

  const saveAllPrices = async () => {
    if (Object.keys(editedPrices).length === 0) {
      toast.info("لا توجد تغييرات للحفظ");
      return;
    }

    setSaving(true);
    try {
      for (const [wilaya, { home, office }] of Object.entries(editedPrices)) {
        await supabase
          .from("delivery_prices")
          .update({ home_price: home, office_price: office })
          .eq("wilaya", wilaya);
      }
      toast.success("تم حفظ الأسعار بنجاح");
      setEditedPrices({});
      refetch();
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">أسعار التوصيل</h2>
        <Button onClick={saveAllPrices} disabled={saving || Object.keys(editedPrices).length === 0}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
          حفظ التغييرات
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 font-semibold text-sm">
          <span>الولاية</span>
          <span>المكتب (دج)</span>
          <span>المنزل (دج)</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {prices?.map((price) => (
            <div key={price.id} className="grid grid-cols-3 gap-4 p-4 border-t border-border/30 items-center">
              <span className="text-sm">{price.wilaya}</span>
              <Input
                type="number"
                defaultValue={price.office_price}
                onChange={(e) => handlePriceChange(price.wilaya, "office", e.target.value)}
                className="h-9"
              />
              <Input
                type="number"
                defaultValue={price.home_price}
                onChange={(e) => handlePriceChange(price.wilaya, "home", e.target.value)}
                className="h-9"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPricesPage;
