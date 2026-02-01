import { useState, useRef } from "react";
import { useSettings, useUpdateSetting } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Loader2, Video } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-video-${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error } = await supabase.storage
        .from("product-media")
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("product-media")
        .getPublicUrl(filePath);

      await updateSetting.mutateAsync({
        key: "hero_video",
        value: data.publicUrl,
      });

      toast.success("تم تحديث فيديو الهيرو بنجاح");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("حدث خطأ أثناء رفع الفيديو");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">الإعدادات</h2>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الإعدادات</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            فيديو الهيرو
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings?.hero_video && (
            <div className="rounded-lg overflow-hidden bg-muted">
              <video
                src={settings.hero_video}
                controls
                className="w-full max-h-64 object-cover"
              />
            </div>
          )}

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />

          <div className="flex gap-2">
            <Button
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 ml-2" />
                  تغيير الفيديو
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• يُنصح باستخدام فيديو بدقة عالية (1080p أو أعلى)</p>
            <p>• الحجم الأقصى المسموح: 50 ميغابايت</p>
            <p>• الصيغ المدعومة: MP4, WebM</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
