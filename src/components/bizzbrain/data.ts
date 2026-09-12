import type { Message, Thread } from "./types";

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
    preview: "50 Tea × ₹15 recorded ✓",
    time: "5:58 pm",
    initials: "DS",
    accent: "leaf",
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
    id: "supplier",
    name: "Murugan — Supplier",
    preview: "Bill photo received",
    time: "Yesterday",
    initials: "M",
    accent: "brand",
  },
  {
    id: "reports",
    name: "Monthly Reports",
    preview: "August summary is ready",
    time: "Friday",
    initials: "MR",
    accent: "leaf",
  },
];

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
      badge: "✓",
      rows: [
        { label: "Item", value: "Tea × 50" },
        { label: "Rate", value: "₹15" },
        { label: "Total", value: "₹750", strong: true },
      ],
      footnote: "Added to today's sales · 12 Sep",
    },
  },
  {
    id: "m3",
    from: "user",
    time: "6:04 pm",
    status: "read",
    voice: { seconds: 7, transcript: "Murugan ku next week 40k pay pannanum." },
    lang: "Tanglish · voice",
  },
  {
    id: "m4",
    from: "bot",
    time: "6:04 pm",
    card: {
      title: "Remembered",
      badge: "✓",
      rows: [
        { label: "Party", value: "Murugan" },
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
      footnote: "11 Sep · aaj ₹1,050 zyada",
    },
  },
];

/** Canned demo replies — matched loosely on keywords, cycling otherwise. */
export const scriptedReplies: { match: RegExp; reply: Omit<Message, "id" | "time" | "from"> }[] = [
  {
    match: /(tea|chai|vithen|sold|sale|bech)/i,
    reply: {
      card: {
        title: "Sale recorded",
        badge: "✓",
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
    match: /(pay|due|kadan|udhaar|pending|40k|murugan)/i,
    reply: {
      card: {
        title: "Remembered",
        badge: "✓",
        rows: [
          { label: "Party", value: "Murugan" },
          { label: "Amount", value: "₹40,000", strong: true },
          { label: "Due", value: "Next week · 19 Sep" },
        ],
        footnote: "Saved to Business Memory · reminder set",
      },
    },
  },
  {
    match: /(profit|labh|laabh|evlo|kitna|earning)/i,
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
    match: /(stock|sugar|milk|paal|saman)/i,
    reply: {
      card: {
        title: "Stock check",
        rows: [
          { label: "Sugar", value: "4 kg — low" },
          { label: "Milk", value: "28 L" },
          { label: "Tea powder", value: "9 kg" },
        ],
        footnote: "Reorder sugar before tomorrow morning",
      },
    },
  },
];

export const fallbackReply: Omit<Message, "id" | "time" | "from"> = {
  text: "Purinjiruchu ✓ Naan idha business memory la save panniten. Sollunga — sales, payment, stock, illa profit?",
};
