import type { BusinessMemoryState, Message, Thread } from "./types";

export const threads: Thread[] = [
  {
    id: "bizzbrain",
    name: "BizzBrain",
    preview: "Today's Profit — ₹14,300",
    time: "6:42 pm",
    initials: "BB",
    pinned: true,
    accent: "brand",
  },
  {
    id: "payments",
    name: "Payments & Dues",
    preview: "Murugan — ₹40,000 due next week",
    time: "6:31 pm",
    unread: 2,
    initials: "PD",
    accent: "teal",
  },
  {
    id: "sales",
    name: "Daily Sales Log",
    preview: "Innu 60 Chaya × ₹15 recorded",
    time: "6:01 pm",
    initials: "DS",
    accent: "leaf",
  },
  {
    id: "gst-compliance",
    name: "GST & Tax Desk",
    preview: "GSTR-3B due on 20 Sep",
    time: "5:15 pm",
    initials: "GT",
    accent: "teal",
  },
  {
    id: "kerala-vendor",
    name: "Kunjumon — Kerala Supplies",
    preview: "₹35,000 due next week",
    time: "4:30 pm",
    initials: "KS",
    accent: "brand",
  },
  {
    id: "stock",
    name: "Stock Alerts",
    preview: "Sugar low — 4 kg left",
    time: "2:14 pm",
    unread: 1,
    initials: "SA",
    accent: "teal",
  },
  {
    id: "reports",
    name: "Daily & Monthly Reports",
    preview: "Closing statement ready",
    time: "Yesterday",
    initials: "MR",
    accent: "leaf",
  },
];

export const initialBusinessMemory: BusinessMemoryState = {
  profile: {
    name: "Vasantham Tea & Snacks",
    category: "Tea & Snacks",
    location: "Madurai, Tamil Nadu",
    closingTime: "10:30 PM",
    gstin: "33AAAAA0000A1Z5",
    gstFilingFrequency: "Monthly",
  },
  today: {
    revenue: 18500,
    expenses: 4200,
    profit: 14300,
    entriesCount: 63,
  },
  dues: [
    { id: "due-1", name: "Murugan — Supplier", amount: 40000, due: "Due next week · 19 Sep" },
    { id: "due-2", name: "Milk vendor", amount: 6800, due: "Due Monday" },
    { id: "due-3", name: "Shop rent", amount: 12000, due: "Due 1 Oct" },
  ],
  topItems: [
    { name: "Tea (Chaya)", quantity: "212 cups", count: 212, pct: 88 },
    { name: "Medhu Vada", quantity: "96 pcs", count: 96, pct: 54 },
    { name: "Filter Coffee", quantity: "61 cups", count: 61, pct: 34 },
  ],
  gstReminders: [
    {
      id: "gst-1",
      filingName: "GSTR-3B",
      period: "August 2026",
      dueDate: "20 Sep 2026",
      daysRemaining: 7,
      status: "Due Soon",
      estimatedTax: 3450,
    },
    {
      id: "gst-2",
      filingName: "GSTR-1",
      period: "August 2026",
      dueDate: "11 Sep 2026",
      daysRemaining: 0,
      status: "Filed",
    },
  ],
  menuCatalog: [
    { name: "Tea (Chaya)", rate: 15, category: "Beverages" },
    { name: "Filter Coffee", rate: 25, category: "Beverages" },
    { name: "Medhu Vada", rate: 10, category: "Snacks" },
    { name: "Hot Samosa", rate: 20, category: "Snacks" },
    { name: "Masala Dosa", rate: 60, category: "Tiffin" },
  ],
};

export const seedMessages: Message[] = [
  {
    id: "m1",
    from: "user",
    time: "5:56 pm",
    status: "read",
    text: "Innaiku 50 tea vithen, one 15 rupees.",
    lang: "Tanglish",
  },
  {
    id: "m2",
    from: "bot",
    time: "5:56 pm",
    card: {
      title: "Sale recorded",
      badge: "Verified",
      rows: [
        { label: "Item", value: "Tea × 50" },
        { label: "Rate", value: "₹15" },
        { label: "Total", value: "₹750", strong: true },
      ],
      footnote: "Added to today's sales · 12 Sep",
    },
  },
  {
    id: "m2-ml",
    from: "user",
    time: "6:01 pm",
    status: "read",
    voice: {
      seconds: 6,
      transcript: "Innu 60 chaya vittu, onninu 15 roopa.",
      nativeScript: "ഇന്ന് 60 ചായ വിറ്റു, ഒരെണ്ണത്തിന് 15 രൂപ.",
      language: "Malayalam",
    },
    lang: "Malayalam · voice",
  },
  {
    id: "m2-ml-bot",
    from: "bot",
    time: "6:01 pm",
    card: {
      title: "Sale recorded",
      badge: "Verified",
      rows: [
        { label: "Item", value: "Chaya (Tea) × 60" },
        { label: "Rate", value: "₹15" },
        { label: "Total", value: "₹900", strong: true },
      ],
      footnote: "Saved in Business Memory · 12 Sep",
    },
  },
  {
    id: "m3",
    from: "user",
    time: "6:04 pm",
    status: "read",
    voice: {
      seconds: 7,
      transcript: "Murugan ku next week 40k pay pannanum.",
      nativeScript: "முருகனுக்கு அடுத்த வாரம் 40k பணம் கொடுக்கணும்.",
      language: "Tamil",
    },
    lang: "Tanglish · voice",
  },
  {
    id: "m4",
    from: "bot",
    time: "6:04 pm",
    card: {
      title: "Remembered",
      badge: "Pending Due",
      rows: [
        { label: "Party", value: "Murugan — Supplier" },
        { label: "Amount", value: "₹40,000", strong: true },
        { label: "Due", value: "Next week · 19 Sep" },
      ],
      footnote: "Saved to Business Memory · reminder set",
    },
  },
  {
    id: "m5",
    from: "user",
    time: "6:41 pm",
    status: "read",
    text: "Innaiku profit evlo?",
    lang: "Tamil",
  },
  {
    id: "m6",
    from: "bot",
    time: "6:42 pm",
    card: {
      title: "Today's Profit",
      rows: [
        { label: "Revenue", value: "₹18,500" },
        { label: "Expenses", value: "₹4,200" },
        { label: "Profit", value: "₹14,300", strong: true },
      ],
      footnote: "12 Sep · 63 entries · +8% vs yesterday",
    },
  },
  {
    id: "m7",
    from: "user",
    time: "6:43 pm",
    status: "read",
    text: "Aur kal ka kitna tha?",
    lang: "Hindi",
  },
  {
    id: "m8",
    from: "bot",
    time: "6:43 pm",
    card: {
      title: "Kal ka profit",
      rows: [
        { label: "Revenue", value: "₹17,100" },
        { label: "Expenses", value: "₹3,850" },
        { label: "Profit", value: "₹13,250", strong: true },
      ],
      footnote: "11 Sep · ₹1,050 higher today",
    },
  },
];

export const scriptedReplies: { match: RegExp; reply: Omit<Message, "id" | "time" | "from"> }[] = [
  {
    match: /(tea|chai|chaya|vithen|vittu|sold|sale|bech)/i,
    reply: {
      card: {
        title: "Sale recorded",
        badge: "Verified",
        rows: [
          { label: "Item", value: "Tea × 50" },
          { label: "Rate", value: "₹15" },
          { label: "Total", value: "₹750", strong: true },
        ],
        footnote: "Added to today's sales",
      },
    },
  },
  {
    match: /(pay|due|kadan|udhaar|pending|40k|murugan|kunjumon|kodukkanam)/i,
    reply: {
      card: {
        title: "Remembered",
        badge: "Pending",
        rows: [
          { label: "Party", value: "Supplier" },
          { label: "Amount", value: "₹40,000", strong: true },
          { label: "Due", value: "Next week · 19 Sep" },
        ],
        footnote: "Saved to Business Memory · reminder set",
      },
    },
  },
  {
    match: /(profit|labh|laabh|laabham|evlo|kitna|ethraya|earning)/i,
    reply: {
      card: {
        title: "Today's Profit",
        rows: [
          { label: "Revenue", value: "₹18,500" },
          { label: "Expenses", value: "₹4,200" },
          { label: "Profit", value: "₹14,300", strong: true },
        ],
        footnote: "12 Sep · 63 entries",
      },
    },
  },
  {
    match: /(stock|sugar|milk|paal|panchasara|saman)/i,
    reply: {
      card: {
        title: "Stock Check",
        badge: "Status",
        rows: [
          { label: "Sugar (Panchasara)", value: "4 kg — Low" },
          { label: "Milk (Paal)", value: "28 Litres" },
          { label: "Tea Powder", value: "9 kg" },
        ],
        footnote: "Reorder sugar before tomorrow morning",
      },
    },
  },
];

export const fallbackReply: Omit<Message, "id" | "time" | "from"> = {
  text: "Understood. Noted in Business Memory. Would you like to check sales, dues, stock, or closing report?",
};
