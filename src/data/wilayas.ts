export interface Commune {
  id: string;
  name: string;
}

export interface Wilaya {
  id: string;
  name: string;
  communes: Commune[];
}

export const wilayas: Wilaya[] = [
  {
    id: "01",
    name: "أدرار",
    communes: [
      { id: "0101", name: "أدرار" },
      { id: "0102", name: "تيميمون" },
      { id: "0103", name: "رقان" },
      { id: "0104", name: "أولف" },
      { id: "0105", name: "زاوية كنتة" },
    ],
  },
  {
    id: "02",
    name: "الشلف",
    communes: [
      { id: "0201", name: "الشلف" },
      { id: "0202", name: "تنس" },
      { id: "0203", name: "الشطية" },
      { id: "0204", name: "بوقادير" },
      { id: "0205", name: "واد فضة" },
    ],
  },
  {
    id: "03",
    name: "الأغواط",
    communes: [
      { id: "0301", name: "الأغواط" },
      { id: "0302", name: "أفلو" },
      { id: "0303", name: "قصر الحيران" },
      { id: "0304", name: "حاسي الرمل" },
      { id: "0305", name: "عين ماضي" },
    ],
  },
  {
    id: "04",
    name: "أم البواقي",
    communes: [
      { id: "0401", name: "أم البواقي" },
      { id: "0402", name: "عين البيضاء" },
      { id: "0403", name: "عين مليلة" },
      { id: "0404", name: "سيقوس" },
      { id: "0405", name: "عين فكرون" },
    ],
  },
  {
    id: "05",
    name: "باتنة",
    communes: [
      { id: "0501", name: "باتنة" },
      { id: "0502", name: "بريكة" },
      { id: "0503", name: "عين التوتة" },
      { id: "0504", name: "نقاوس" },
      { id: "0505", name: "مروانة" },
    ],
  },
  {
    id: "06",
    name: "بجاية",
    communes: [
      { id: "0601", name: "بجاية" },
      { id: "0602", name: "أقبو" },
      { id: "0603", name: "سيدي عيش" },
      { id: "0604", name: "القل" },
      { id: "0605", name: "تيشي" },
    ],
  },
  {
    id: "07",
    name: "بسكرة",
    communes: [
      { id: "0701", name: "بسكرة" },
      { id: "0702", name: "طولقة" },
      { id: "0703", name: "أورلال" },
      { id: "0704", name: "سيدي عقبة" },
      { id: "0705", name: "زريبة الوادي" },
    ],
  },
  {
    id: "08",
    name: "بشار",
    communes: [
      { id: "0801", name: "بشار" },
      { id: "0802", name: "القنادسة" },
      { id: "0803", name: "العبادلة" },
      { id: "0804", name: "كرزاز" },
      { id: "0805", name: "بني عباس" },
    ],
  },
  {
    id: "09",
    name: "البليدة",
    communes: [
      { id: "0901", name: "البليدة" },
      { id: "0902", name: "الأربعاء" },
      { id: "0903", name: "بوفاريك" },
      { id: "0904", name: "المفتاح" },
      { id: "0905", name: "موزاية" },
    ],
  },
  {
    id: "10",
    name: "البويرة",
    communes: [
      { id: "1001", name: "البويرة" },
      { id: "1002", name: "سور الغزلان" },
      { id: "1003", name: "عين بسام" },
      { id: "1004", name: "برج أوخريص" },
      { id: "1005", name: "لقاطة" },
    ],
  },
];
