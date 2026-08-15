import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Static, store-wide FAQ (intentionally hardcoded — not product data) */
const STORE_FAQ = [
  {
    q: "كيف يمكنني الطلب؟",
    a: "اختر الصنف ثم المنتج الذي يعجبك، اضغط على «اطلب الآن»، حدّد اللون والمقاس والكمية إن وُجدت، ثم أدخل اسمك ورقم هاتفك وعنوان التوصيل وأكّد الطلب. سنتواصل معك هاتفياً لتأكيد الطلب.",
  },
  {
    q: "هل أحتاج إلى إنشاء حساب للطلب؟",
    a: "لا، الطلب يتم مباشرة من صفحة المنتج دون الحاجة إلى إنشاء حساب. يكفي إدخال اسمك ورقم هاتفك ومعلومات التوصيل.",
  },
  {
    q: "إلى أين توصلون؟",
    a: "نوصّل إلى جميع ولايات الوطن الـ58، مع إمكانية التوصيل إلى المنزل أو إلى مكتب التوصيل في الولايات التي تتوفر فيها مكاتب.",
  },
  {
    q: "كم تبلغ تكلفة التوصيل؟",
    a: "تختلف تكلفة التوصيل حسب الولاية ونوع التوصيل (منزل أو مكتب). يتم احتساب السعر تلقائياً وعرضه لك داخل استمارة الطلب قبل التأكيد.",
  },
  {
    q: "كم يستغرق التوصيل؟",
    a: "تختلف مدة التوصيل حسب الولاية وشركة التوصيل. سيتم إعلامك بالتفاصيل عند الاتصال بك لتأكيد الطلب.",
  },
  {
    q: "كيف أعرف أن المنتج متوفر؟",
    a: "الكمية المتوفرة محدّثة مباشرة في الموقع. إذا نفدت الكمية يظهر على المنتج «نفذت الكمية» ولا يمكن طلبه حتى تتم إعادة توفيره.",
  },
  {
    q: "هل يمكنني معرفة حالة طلبي؟",
    a: "نعم، يتم تحديث حالة الطلب لدينا (قيد الانتظار، مؤكد، تم الشحن، تم التوصيل)، ونتواصل معك عبر رقم الهاتف الذي أدخلته لإعلامك بأي تحديث.",
  },
  {
    q: "هل يمكنني إلغاء أو تعديل طلبي؟",
    a: "نعم، يمكنك ذلك قبل شحن الطلب عبر التواصل معنا على رقم الهاتف أو حسابات التواصل الاجتماعي الخاصة بالمتجر.",
  },
  {
    q: "هل يمكنني إرجاع المنتج؟",
    a: "نعم، وفقاً لسياسة الإرجاع المعتمدة لدى المتجر. تواصل معنا مباشرة لشرح الحالة وسنساعدك في الإجراء المناسب.",
  },
  {
    q: "كيف يمكنني التواصل مع المتجر؟",
    a: "يمكنك التواصل معنا عبر حساباتنا على إنستغرام وفيسبوك وتيك توك، والروابط متوفرة في أسفل الصفحة.",
  },
];

const StoreFaqSection = () => {
  return (
    <section
      id="faq"
      dir="rtl"
      className="py-16 px-4 bg-background"
      aria-label="الأسئلة الشائعة"
    >
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 space-y-3"
        >
          <div className="flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-gold" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold">الأسئلة الشائعة</h2>
          </div>
          <p className="text-muted-foreground">كل ما تحتاج معرفته قبل الطلب من Sneaky Shop</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border/50 bg-card/50 px-4 md:px-6"
          >
            {STORE_FAQ.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-border/40">
                <AccordionTrigger className="text-right text-base hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreFaqSection;
