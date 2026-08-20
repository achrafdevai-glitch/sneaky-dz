import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useProductFaqs,
  useCreateFaq,
  useDeleteFaq,
} from "@/hooks/useProductFaqs";

interface ProductFaqManagerProps {
  productId: string;
}

const ProductFaqManager = ({ productId }: ProductFaqManagerProps) => {
  const { data: faqs, isLoading } = useProductFaqs(productId);
  const createFaq = useCreateFaq();
  const deleteFaq = useDeleteFaq();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("يرجى إدخال السؤال والجواب");
      return;
    }
    try {
      await createFaq.mutateAsync({
        product_id: productId,
        question,
        answer,
        position: faqs?.length || 0,
      });
      setQuestion("");
      setAnswer("");
      toast.success("تمت إضافة السؤال");
    } catch {
      toast.error("تعذّرت إضافة السؤال");
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border border-border/50 bg-secondary/20">
      <Label className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-gold" />
        الأسئلة الشائعة لهذا المنتج
      </Label>

      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        (faqs || []).map((faq) => (
          <div
            key={faq.id}
            className="flex items-start justify-between gap-2 p-3 rounded-lg bg-card border border-border/50"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium break-words">{faq.question}</p>
              <p className="text-xs text-muted-foreground break-words">{faq.answer}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => deleteFaq.mutate({ id: faq.id, productId })}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))
      )}

      <Input
        placeholder="السؤال"
        maxLength={300}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Textarea
        placeholder="الجواب"
        maxLength={2000}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <Button type="button" variant="outline" onClick={handleAdd} disabled={createFaq.isPending}>
        {createFaq.isPending ? (
          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
        ) : (
          <Plus className="h-4 w-4 ml-2" />
        )}
        إضافة سؤال
      </Button>
    </div>
  );
};

export default ProductFaqManager;
