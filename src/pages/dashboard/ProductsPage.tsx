import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  Product,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Upload, X, Loader2, Palette, MessageSquare, Package } from "lucide-react";
import { toast } from "sonner";

const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44"];

const ProductsPage = () => {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [colorInput, setColorInput] = useState("#000000");

  const [formData, setFormData] = useState({
    name: "",
    old_price: "",
    new_price: "",
    images: [] as string[],
    video_url: "",
    category_id: null as string | null,
    sizes: [] as string[],
    colors: [] as string[],
    shoe_sizes: [] as string[],
    notes: "",
    show_notes: false,
    show_quantity: false,
    stock: "" as string,
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      old_price: "",
      new_price: "",
      images: [],
      video_url: "",
      category_id: null,
      sizes: [],
      colors: [],
      shoe_sizes: [],
      notes: "",
      show_notes: false,
      show_quantity: false,
      stock: "",
    });
    setEditingProduct(null);
    setColorInput("#000000");
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      old_price: product.old_price.toString(),
      new_price: product.new_price.toString(),
      images: product.images || [],
      video_url: product.video_url || "",
      category_id: product.category_id,
      sizes: product.sizes || [],
      colors: product.colors || [],
      shoe_sizes: product.shoe_sizes || [],
      notes: product.notes || "",
      show_notes: product.show_notes || false,
      show_quantity: product.show_quantity || false,
      stock: product.stock?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("product-media")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-media")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadFile(file, "images")
      );
      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
      toast.success("تم رفع الصور بنجاح");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("حدث خطأ أثناء رفع الصور");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, "videos");
      setFormData((prev) => ({ ...prev, video_url: url }));
      toast.success("تم رفع الفيديو بنجاح");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("حدث خطأ أثناء رفع الفيديو");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleShoeSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      shoe_sizes: prev.shoe_sizes.includes(size)
        ? prev.shoe_sizes.filter((s) => s !== size)
        : [...prev.shoe_sizes, size],
    }));
  };

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput],
      }));
    }
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      old_price: parseFloat(formData.old_price),
      new_price: parseFloat(formData.new_price),
      images: formData.images,
      video_url: formData.video_url || null,
      category_id: formData.category_id,
      sizes: formData.sizes,
      colors: formData.colors,
      shoe_sizes: formData.shoe_sizes,
      notes: formData.notes || null,
      show_notes: formData.show_notes,
      show_quantity: formData.show_quantity,
      stock: formData.stock ? parseInt(formData.stock) : null,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await createProduct.mutateAsync(productData);
        toast.success("تم إضافة المنتج بنجاح");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("تم حذف المنتج");
      } catch (error) {
        console.error("Error:", error);
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">المنتجات</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">المنتجات</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-black">
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المنتج</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>الصنف</Label>
                <Select
                  value={formData.category_id || "none"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category_id: value === "none" ? null : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصنف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون صنف</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="old_price">السعر القديم</Label>
                  <Input
                    id="old_price"
                    type="number"
                    value={formData.old_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        old_price: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_price">السعر الجديد</Label>
                  <Input
                    id="new_price"
                    type="number"
                    value={formData.new_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        new_price: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Quantity Toggle */}
              <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-gold" />
                    <div>
                      <Label>إظهار خيار الكمية للزبون</Label>
                      <p className="text-xs text-muted-foreground">يمكن للزبون اختيار الكمية عند الطلب</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.show_quantity}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, show_quantity: checked }))
                    }
                  />
                </div>
                
                {/* Stock Input */}
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <Label>الكمية المتوفرة في المخزن</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="اتركه فارغاً إذا كانت الكمية غير محدودة"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, stock: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">عند نفاد الكمية سيظهر للزبون "نفذت الكمية"</p>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gold" />
                    <div>
                      <Label>إظهار الملاحظات للزبون</Label>
                      <p className="text-xs text-muted-foreground">ستظهر هذه الملاحظات في صفحة الطلب</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.show_notes}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, show_notes: checked }))
                    }
                  />
                </div>
                {formData.show_notes && (
                  <Textarea
                    placeholder="أضف ملاحظات للزبون (مثل: هذا المنتج متوفر بكميات محدودة)"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="mt-2"
                  />
                )}
              </div>

              {/* Clothing Sizes */}
              <div className="space-y-2">
                <Label>مقاسات الملابس</Label>
                <div className="flex flex-wrap gap-2">
                  {CLOTHING_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.sizes.includes(size)
                          ? "bg-gold text-black border-gold"
                          : "border-border hover:border-gold/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shoe Sizes */}
              <div className="space-y-2">
                <Label>مقاسات الأحذية</Label>
                <div className="flex flex-wrap gap-2">
                  {SHOE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleShoeSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.shoe_sizes.includes(size)
                          ? "bg-gold text-black border-gold"
                          : "border-border hover:border-gold/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>الألوان</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Button type="button" variant="outline" onClick={addColor}>
                    <Palette className="h-4 w-4 ml-2" />
                    إضافة لون
                  </Button>
                </div>
                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary"
                      >
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>صور المنتج</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 ml-2" />
                  )}
                  رفع صور
                </Button>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt=""
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>فيديو المنتج (اختياري)</Label>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 ml-2" />
                  )}
                  رفع فيديو
                </Button>
                {formData.video_url && (
                  <div className="flex items-center gap-2 mt-2">
                    <video
                      src={formData.video_url}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, video_url: "" }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black" disabled={isUploading}>
                {editingProduct ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!products || products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <p className="text-muted-foreground text-lg">لا توجد منتجات بعد</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all group"
              >
                <div className="aspect-square relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">لا توجد صورة</span>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.show_quantity && (
                      <span className="bg-gold/90 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        الكمية
                      </span>
                    )}
                    {product.show_notes && (
                      <span className="bg-gold/90 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        ملاحظة
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground line-through text-sm">
                      {product.old_price.toLocaleString()} د.ج
                    </span>
                    <span className="font-bold text-gold">
                      {product.new_price.toLocaleString()} د.ج
                    </span>
                  </div>
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-1">
                      {product.colors.slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
