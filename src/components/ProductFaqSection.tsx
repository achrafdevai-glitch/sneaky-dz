import { HelpCircle } from "lucide-react";
import { useProductFaqs } from "@/hooks/useProductFaqs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductFaqSectionProps {
  productId: string;
}

const ProductFaqSection = ({ productId }: ProductFaqSectionProps) => {
  const { data: faqs, isLoading, isError } = useProductFaqs(productId);

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-xl" />;
  }

  if (isError || !faqs || faqs.length === 0) return null;

  return (
    <section className="space-y-3" aria-label="الأسئلة الشائعة حول المنتج">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-semibold">الأسئلة الشائعة</h3>
      </div>

      <Accordion type="single" collapsible className="rounded-2xl border border-border/50 px-4 bg-secondary/30">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border-border/40">
            <AccordionTrigger className="text-right text-sm hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default ProductFaqSection;
