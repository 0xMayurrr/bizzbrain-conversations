export type Sender = "user" | "bot";

export type CardRow = { label: string; value: string; strong?: boolean };

export type Message = {
  id: string;
  from: Sender;
  time: string;
  status?: "sent" | "delivered" | "read";
  /** plain text body */
  text?: string;
  /** voice-note style message */
  voice?: { seconds: number; transcript: string };
  /** structured record card rendered inside the bubble */
  card?: {
    title: string;
    badge?: string;
    rows: CardRow[];
    footnote?: string;
  };
  /** small language tag shown under an incoming user message */
  lang?: string;
};

export type Thread = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  initials: string;
  pinned?: boolean;
  accent?: "brand" | "teal" | "leaf";
};
