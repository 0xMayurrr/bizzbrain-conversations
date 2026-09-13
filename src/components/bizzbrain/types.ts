export type Sender = "user" | "bot";

export type CardRow = { label: string; value: string; strong?: boolean | undefined };

export type SupportedLanguage = "Tamil" | "Malayalam" | "Hindi" | "English";

export type BusinessCategory =
  | "Tea & Snacks"
  | "Kirana & Grocery"
  | "Bakery & Cafe"
  | "Restaurant"
  | "Retail & Wholesale";

export type BusinessProfile = {
  name: string;
  category: BusinessCategory;
  location: string;
  closingTime: string;
  gstin?: string | undefined;
  gstFilingFrequency?: "Monthly" | "Quarterly" | undefined;
};

export type GstReminder = {
  id: string;
  filingName: "GSTR-3B" | "GSTR-1" | "CMP-08";
  period: string;
  dueDate: string;
  daysRemaining: number;
  status: "Due Soon" | "Upcoming" | "Filed";
  estimatedTax?: number | undefined;
};

export type MenuItem = {
  name: string;
  rate: number;
  category?: string | undefined;
};

export type MessageDocument = {
  fileName: string;
  fileSize: string;
  fileType: "pdf";
  title: string;
  date: string;
  summary: {
    revenue: number;
    expenses: number;
    profit: number;
    entriesCount: number;
  };
};

export type Message = {
  id: string;
  from: Sender;
  time: string;
  status?: "sent" | "delivered" | "read" | undefined;
  /** plain text body */
  text?: string | undefined;
  /** voice-note style message */
  voice?: {
    seconds: number;
    transcript: string;
    nativeScript?: string | undefined;
    audioUrl?: string | undefined;
    language?: SupportedLanguage | string | undefined;
  } | undefined;
  /** structured record card rendered inside the bubble */
  card?: {
    title: string;
    badge?: string | undefined;
    rows: CardRow[];
    footnote?: string | undefined;
  } | undefined;
  /** PDF or file attachment */
  document?: MessageDocument | undefined;
  /** Uploaded photo (e.g. Menu card or document) */
  photo?: {
    url?: string | undefined;
    imageUrl?: string | undefined;
    caption?: string | undefined;
    extractedItems?: MenuItem[] | undefined;
  } | undefined;
  /** small language tag shown under an incoming user message */
  lang?: string | undefined;
};

export type Thread = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: number | undefined;
  initials: string;
  pinned?: boolean | undefined;
  accent?: "brand" | "teal" | "leaf" | undefined;
};

export type PendingDue = {
  id: string;
  name: string;
  amount: number;
  due: string;
};

export type TopItem = {
  name: string;
  quantity: string;
  count: number;
  pct: number;
};

export type BusinessMemoryState = {
  profile: BusinessProfile;
  today: {
    revenue: number;
    expenses: number;
    profit: number;
    entriesCount: number;
  };
  dues: PendingDue[];
  topItems: TopItem[];
  gstReminders: GstReminder[];
  menuCatalog: MenuItem[];
};
