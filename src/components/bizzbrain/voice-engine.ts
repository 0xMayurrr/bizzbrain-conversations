import type {
  BusinessCategory,
  BusinessMemoryState,
  CardRow,
  GstReminder,
  MenuItem,
  MessageDocument,
  SupportedLanguage,
} from "./types";

export interface VoicePreset {
  id: string;
  language: SupportedLanguage;
  flag: string;
  transcript: string;
  nativeScript: string;
  seconds: number;
  description: string;
  sampleIntent: "sale" | "due" | "profit" | "stock" | "report" | "menu" | "gst" | "onboard" | "store";
}

export const voicePresets: VoicePreset[] = [
  {
    id: "preset-onboard",
    language: "English",
    flag: "SETUP",
    transcript: "Hi, I want to onboard my new business to BizzBrain.",
    nativeScript: "Start Onboarding · Answer 3 conversational setup questions in chat.",
    seconds: 4,
    description: "Start WhatsApp Onboarding",
    sampleIntent: "onboard",
  },
  {
    id: "preset-store-name",
    language: "English",
    flag: "STORE",
    transcript: "My store name is Grand Kerala Bakery & Cafe, Kochi.",
    nativeScript: "Step 1 Answer · Register store name, bakery category and location.",
    seconds: 4,
    description: "Set Store Name & City",
    sampleIntent: "store",
  },
  {
    id: "preset-menu-scan",
    language: "English",
    flag: "SCAN",
    transcript: "Uploaded menu card photo. Please extract all food items and prices.",
    nativeScript: "Step 2 Answer · OCR extracts 5 dishes & rates into store catalog.",
    seconds: 4,
    description: "Scan Menu Photo via OCR",
    sampleIntent: "menu",
  },
  {
    id: "preset-gst-reg",
    language: "English",
    flag: "GST",
    transcript: "Register shop GSTIN 32BBBBB1111B2Z6 and set up tax reminders.",
    nativeScript: "Step 3 Answer · Set GSTR-1 and GSTR-3B compliance calendar.",
    seconds: 5,
    description: "Set Store GSTIN & Deadlines",
    sampleIntent: "gst",
  },
  {
    id: "preset-ml-sale",
    language: "Malayalam",
    flag: "ML",
    transcript: "Innu 60 chaya vittu, onninu 15 roopa.",
    nativeScript: "ഇന്ന് 60 ചായ വിറ്റു, ഒരെണ്ണത്തിന് 15 രൂപ.",
    seconds: 6,
    description: "Malayalam · Sale of 60 teas",
    sampleIntent: "sale",
  },
  {
    id: "preset-ml-due",
    language: "Malayalam",
    flag: "ML",
    transcript: "Kunjumon-u adutha aazhcha 35,000 kodukkanam.",
    nativeScript: "കുഞ്ഞുമോന് അടുത്ത ആഴ്ച 35,000 കൊടുക്കണം.",
    seconds: 5,
    description: "Malayalam · Due payment to Kunjumon",
    sampleIntent: "due",
  },
  {
    id: "preset-hi-stock",
    language: "Hindi",
    flag: "HI",
    transcript: "Sugar stock kitna bacha hai?",
    nativeScript: "शुगर स्टॉक कितना बचा है?",
    seconds: 4,
    description: "Hindi · Sugar stock check",
    sampleIntent: "stock",
  },
  {
    id: "preset-ta-sale",
    language: "Tamil",
    flag: "TA",
    transcript: "Innaiku 50 tea vithen, one 15 rupees.",
    nativeScript: "இன்னைக்கு 50 டீ வித்தேன், ஒன்னு 15 ரூபாய்.",
    seconds: 5,
    description: "Tamil · Sale of 50 teas",
    sampleIntent: "sale",
  },

  {
    id: "preset-report",
    language: "English",
    flag: "DOC",
    transcript: "Close shop for today and send the daily PDF report.",
    nativeScript: "Shop closing statement · Generate official EOD PDF report.",
    seconds: 5,
    description: "EOD Close & Daily PDF Report",
    sampleIntent: "report",
  },
  {
    id: "preset-en-sale",
    language: "English",
    flag: "EN",
    transcript: "Sold 35 coffees for 25 rupees each.",
    nativeScript: "Sold 35 cups of filter coffee at 25 rupees each.",
    seconds: 4,
    description: "English · Sale of 35 coffees",
    sampleIntent: "sale",
  },
];

/**
 * Generates a realistic WAV audio file in browser memory
 * using harmonic tones simulating speech cadence.
 */
export function generateSyntheticVoiceAudio(durationSeconds: number = 5): string {
  if (typeof window === "undefined") return "";

  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  const baseFreq = 180;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const syllabicMod = 0.5 + 0.5 * Math.sin(2 * Math.PI * 3.5 * t);
    const formant1 = Math.sin(2 * Math.PI * baseFreq * t);
    const formant2 = 0.5 * Math.sin(2 * Math.PI * (baseFreq * 2.2) * t);
    const formant3 = 0.25 * Math.sin(2 * Math.PI * (baseFreq * 3.4) * t);

    const attack = Math.min(1, t / 0.1);
    const release = Math.min(1, (durationSeconds - t) / 0.15);
    const envelope = attack * release * syllabicMod;

    const sample = Math.max(-1, Math.min(1, (formant1 + formant2 + formant3) * envelope * 0.45));
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

/** Detects language from speech text */
export function detectLanguage(text: string): SupportedLanguage {
  const lower = text.toLowerCase();

  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";
  if (
    /(chaya|vittu|onninu|roopa|kunjumon|kodukkanam|laabham|ethraya|panchasara|theernnu|adutha|aazhcha|kada|adachu|chechi|chettan)/i.test(
      lower
    )
  ) {
    return "Malayalam";
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (
    /(vithen|innaiku|pannanum|murugan|evlo|vanginen|paal|kadan|kadai|close pannu|sarkarai|sollunga)/i.test(
      lower
    )
  ) {
    return "Tamil";
  }

  // Hindi
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  if (
    /(becha|aaj|rupaye|dena|kitna|sharma|khareeda|bacha|paisa|dukaan|bandh|cheeni|chini)/i.test(
      lower
    )
  ) {
    return "Hindi";
  }

  return "English";
}

export interface ProcessedVoiceResult {
  detectedLang: SupportedLanguage;
  transcript: string;
  nativeScript?: string | undefined;
  seconds: number;
  audioUrl?: string | undefined;
  botReply: {
    text?: string | undefined;
    card?: {
      title: string;
      badge?: string | undefined;
      rows: CardRow[];
      footnote?: string | undefined;
    } | undefined;
    document?: MessageDocument | undefined;
    photo?: {
      imageUrl?: string | undefined;
      caption?: string | undefined;
      extractedItems?: MenuItem[] | undefined;
    } | undefined;
  };
  updatedMemory: BusinessMemoryState;
}

/**
 * Processes audio transcription, detects intent, notes in Business Memory,
 * and generates appropriate structured BizzBrain reply.
 */
export function processVoiceTransaction(
  rawTranscript: string,
  currentMemory: BusinessMemoryState,
  options?: {
    nativeScript?: string | undefined;
    audioUrl?: string | undefined;
    seconds?: number | undefined;
    forcedLang?: SupportedLanguage | undefined;
  }
): ProcessedVoiceResult {
  const detectedLang = options?.forcedLang ?? detectLanguage(rawTranscript);
  const lower = rawTranscript.toLowerCase();
  const seconds = options?.seconds ?? Math.floor(Math.random() * 4) + 4;
  const audioUrl = options?.audioUrl ?? generateSyntheticVoiceAudio(seconds);

  let updatedMemory: BusinessMemoryState = {
    profile: currentMemory.profile
      ? { ...currentMemory.profile }
      : {
          name: "Vasantham Tea & Snacks",
          category: "Tea & Snacks",
          location: "Madurai, Tamil Nadu",
          closingTime: "10:30 PM",
          gstin: "33AAAAA0000A1Z5",
          gstFilingFrequency: "Monthly",
        },
    menuCatalog: currentMemory.menuCatalog ? [...currentMemory.menuCatalog] : [],
    gstReminders: currentMemory.gstReminders ? [...currentMemory.gstReminders] : [],
    today: { ...currentMemory.today },
    dues: [...currentMemory.dues],
    topItems: [...currentMemory.topItems],
  };

  // 1. Business Onboarding Greeting & Flow Intent
  const isOnboarding =
    /(\bonboard\b|setup shop|setup store|register shop|new business|setup business|store profile|dukaan register|kada register|start business|business registration|start onboarding|^hi\b|^hello\b|^hey\b)/i.test(
      lower
    ) && !/(sugar|vithen|vittu|becha|pay|kodukkanam|profit|stock|menu|gstin)/i.test(lower);

  if (isOnboarding) {
    const onboardByLang: Record<SupportedLanguage, string> = {
      Malayalam:
        "ബിസ്സ്ബ്രെയിൻ വാട്സ്ആപ്പ് ബിസിനസ്സിലേക്ക് സ്വാഗതം! നിങ്ങളുടെ കട രജിസ്റ്റർ ചെയ്യാൻ 3 ലളിതമായ ചോദ്യങ്ങൾക്ക് മറുപടി നൽകുക:\n\nചോദ്യം 1: നിങ്ങളുടെ കടയുടെ പേര്, കാറ്റഗറി, സ്ഥലം ഏതാണ്? (ഉദാഹരണത്തിന്: 'Grand Kerala Bakery, Kochi')",
      Tamil:
        "BizzBrain வாட்ஸ்அப் பிசினஸுக்கு வரவேற்கிறோம்! உங்கள் கடையை பதிவு செய்ய 3 எளிய கேள்விகள்:\n\nபடி 1: உங்கள் கடையின் பெயர், வகை மற்றும் ஊர் என்ன? (எ.கா: 'Vasantham Tea & Snacks, Madurai')",
      Hindi:
        "BizzBrain व्हाट्सएप बिजनेस में आपका स्वागत है! अपनी दुकान शुरू करने के लिए 3 आसान सवालों के जवाब दीजिए:\n\nपहला सवाल: आपकी दुकान का नाम, श्रेणी और शहर क्या है? (जैसे: 'Vasantham Tea & Snacks, Madurai' या 'Grand Kerala Bakery, Kochi')",
      English:
        "Welcome to BizzBrain on WhatsApp Business! Let's get your store onboarded in 3 simple chat steps:\n\n*Question 1:* What is your *Store Name*, *Business Category*, and *Location*?\n(e.g., 'Grand Kerala Bakery & Cafe, Kochi' or 'Vasantham Tea & Snacks, Madurai')",
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        text: onboardByLang[detectedLang],
        card: {
          title: "Store Onboarding · Question 1",
          badge: "Step 1 of 3",
          rows: [
            { label: "Question 1", value: "Send Store Name, Category & Location", strong: true },
            { label: "Question 2", value: "Send Menu Card Photo (OCR scan)" },
            { label: "Question 3", value: "Send GSTIN (Auto tax reminders)" },
          ],
          footnote: "Reply directly in chat with your store details",
        },
      },
      updatedMemory,
    };
  }

  // 1b. Store Details Answer (Step 1 Answer)
  const isStoreDetailsAnswer =
    /(store name is|shop is|my store|my shop|kerala bakery|tea stall|kirana|restaurant|bakery|cafe|tea & snacks)/i.test(
      lower
    ) && !/(sugar|vithen|vittu|becha|pay|kodukkanam|profit|stock|menu|gstin)/i.test(lower);

  if (isStoreDetailsAnswer) {
    let storeName = "Grand Kerala Bakery & Cafe";
    let category: BusinessCategory = "Bakery & Cafe";
    let location = "Kochi, Kerala";

    if (/vasantham|tea/i.test(lower)) {
      storeName = "Vasantham Tea & Snacks";
      category = "Tea & Snacks";
      location = "Madurai, Tamil Nadu";
    } else if (/kirana|grocery/i.test(lower)) {
      storeName = "Suresh Kirana & General Store";
      category = "Kirana & Grocery";
      location = "Indore, Madhya Pradesh";
    }

    updatedMemory.profile = {
      name: storeName,
      category,
      location,
      closingTime: "10:30 PM",
      gstin: updatedMemory.profile?.gstin || "32BBBBB1111B2Z6",
      gstFilingFrequency: "Monthly",
    };

    const replyByLang: Record<SupportedLanguage, string> = {
      Malayalam: `കടയുടെ വിവരങ്ങൾ രേഖപ്പെടുത്തി!\n\nകട: ${storeName}\nകാറ്റഗറി: ${category}\nസ്ഥലം: ${location}\n\nചോദ്യം 2: ദയവായി നിങ്ങളുടെ മെനു കാർഡിന്റെയോ വിലവിവരപ്പട്ടികയുടെയോ ഒരു ഫോട്ടോ അയക്കുക (പേപ്പർക്ലിപ്പ് ഐക്കൺ വഴി). സാധനങ്ങളും വിലകളും ഞാൻ സ്വയം സ്കാൻ ചെയ്ത് കാറ്റലോഗിൽ ചേർക്കും.`,
      Tamil: `கடையின் விவரங்கள் சேமிக்கப்பட்டன!\n\nகடை: ${storeName}\nஊர்: ${location}\n\nபடி 2: தயவுசெய்து உங்கள் மெனு கார்டின் புகைப்படத்தை அனுப்புங்கள். உணவுகள் மற்றும் விலைகளை நான் தானாக பதிவு செய்வேன்.`,
      Hindi: `दुकान का विवरण दर्ज हो गया!\n\nदुकान: ${storeName}\nश्रेणी: ${category}\nस्थान: ${location}\n\nदूसरा सवाल: कृपया अपने मेन्यू कार्ड या रेट लिस्ट की फोटो भेजें (पेपरक्लिप बटन से)। मैं तुरंत कीमतें स्कैन कर लूंगा।`,
      English: `Store profile registered!\n\n*Store Name:* ${storeName}\n*Category:* ${category}\n*Location:* ${location}\n*Closing Time:* 10:30 PM\n\n*Question 2:* Please attach or send a *photo of your menu card or price list*. I will automatically scan the items and prices into your sales catalog.`,
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        text: replyByLang[detectedLang],
        card: {
          title: "Store Identity Registered",
          badge: "Step 1 Done",
          rows: [
            { label: "Store Name", value: storeName, strong: true },
            { label: "Category", value: category },
            { label: "Location", value: location },
            { label: "Next Step", value: "Attach Menu Card Photo" },
          ],
          footnote: "Business Memory updated · Send menu photo next",
        },
      },
      updatedMemory,
    };
  }

  // 2. Menu Photo / Card OCR Scan Intent (Step 2)
  const isMenuPhoto =
    /(\bmenu\b|menu card|rate card|menu photo|scan menu|food list|price list|rates|menu picture)/i.test(
      lower
    );

  if (isMenuPhoto) {
    const extractedItems: MenuItem[] = [
      { name: "Chaya (Special Tea)", rate: 15, category: "Beverages" },
      { name: "Filter Coffee", rate: 25, category: "Beverages" },
      { name: "Medhu Vada", rate: 10, category: "Snacks" },
      { name: "Hot Samosa", rate: 20, category: "Snacks" },
      { name: "Masala Dosa", rate: 60, category: "Tiffin" },
    ];

    const existingNames = new Set(
      (updatedMemory.menuCatalog ?? []).map((m) => m.name.toLowerCase())
    );
    const newCatalog = [...(updatedMemory.menuCatalog ?? [])];
    for (const item of extractedItems) {
      if (!existingNames.has(item.name.toLowerCase())) {
        newCatalog.push(item);
        existingNames.add(item.name.toLowerCase());
      }
    }
    updatedMemory.menuCatalog = newCatalog;

    const photoReplyByLang: Record<SupportedLanguage, string> = {
      Malayalam:
        "മെനു കാർഡ് സ്കാൻ ചെയ്തു! 5 വിഭവങ്ങളും വിലയും ബിസിനസ് കാറ്റലോഗിൽ ചേർത്തു.\n\nചോദ്യം 3: ഒടുവിലായി, നിങ്ങളുടെ 15 അക്ക GSTIN നമ്പർ അയക്കുക (ഉദാഹരണത്തിന്: 32BBBBB1111B2Z6). GSTR-1, GSTR-3B തീയതികൾ ഞാൻ ഓർമ്മിപ്പിക്കും.",
      Tamil:
        "மெனு கார்டு ஸ்கேன் செய்யப்பட்டது! 5 பொருட்கள் கேட்டலாக்கில் சேமிக்கப்பட்டன.\n\nபடி 3: இறுதியாக, உங்கள் 15 இலக்க ஜிஎஸ்டி எண்ணை அனுப்புங்கள் (எ.கா: 33AAAAA0000A1Z5).",
      Hindi:
        "मेन्यू कार्ड स्कैन हो गया! 5 आइटम और कीमतें कैटलॉग में जोड़ दी गई हैं।\n\nतीसरा सवाल: कृपया अपना 15 अंकों का GSTIN भेजें (जैसे: 32BBBBB1111B2Z6), ताकि मैं GSTR-1 और GSTR-3B के रिमाइंडर सेट कर सकूं।",
      English:
        "Menu card scanned via OCR! Added 5 items and prices to your store catalog.\n\n*Question 3:* Finally, please send your 15-digit *GSTIN* (e.g., 32BBBBB1111B2Z6 or 33AAAAA0000A1Z5) so I can store your tax registration and schedule your GSTR-1 & GSTR-3B reminders.",
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        text: photoReplyByLang[detectedLang],
        photo: {
          caption: "Store Menu Card · OCR Scanned",
          extractedItems,
        },
        card: {
          title: "Menu Items Extracted",
          badge: "Step 2 Done",
          rows: extractedItems.map((it) => ({
            label: `${it.name} (${it.category})`,
            value: `₹${it.rate}`,
            strong: it.name.includes("Tea"),
          })),
          footnote: "Auto-synced to Business Memory · Send GSTIN next",
        },
      },
      updatedMemory,
    };
  }

  // 3. GSTIN Registration & Tax Reminders Intent (Step 3)
  const isGstin =
    /(\bgst\b|gstin|tax id|gstr|gst reminder|gst filing|gst number|tax deadline|gstr-3b|gstr-1|\b\d{2}[a-z]{5}\d{4}[a-z]{1}[1-9a-z]{1}z[0-9a-z]{1}\b)/i.test(
      lower
    );

  if (isGstin) {
    const gstinMatch = rawTranscript.match(
      /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/i
    );
    const detectedGstin = gstinMatch
      ? gstinMatch[0].toUpperCase()
      : updatedMemory.profile?.gstin || "32BBBBB1111B2Z6";

    updatedMemory.profile = {
      name: updatedMemory.profile?.name || "Grand Kerala Bakery & Cafe",
      category: updatedMemory.profile?.category || "Bakery & Cafe",
      location: updatedMemory.profile?.location || "Kochi, Kerala",
      closingTime: updatedMemory.profile?.closingTime || "10:30 PM",
      gstin: detectedGstin,
      gstFilingFrequency: "Monthly",
    };

    const gstReminders: GstReminder[] = [
      {
        id: "gst-gstr3b",
        filingName: "GSTR-3B",
        period: "August 2026",
        dueDate: "20 Sep 2026",
        daysRemaining: 7,
        status: "Due Soon",
        estimatedTax: 3450,
      },
      {
        id: "gst-gstr1",
        filingName: "GSTR-1",
        period: "August 2026",
        dueDate: "11 Sep 2026",
        daysRemaining: 0,
        status: "Filed",
      },
    ];
    updatedMemory.gstReminders = gstReminders;

    const gstinReplyByLang: Record<SupportedLanguage, string> = {
      Malayalam: `ജിഎസ്ടി നമ്പർ (${detectedGstin}) പരിശോധിച്ചു സേവ് ചെയ്തു!\n\nനിങ്ങളുടെ കടയുടെ ഓൺബോർഡിംഗ് പൂർത്തിയായി!\n• GSTR-3B ഡെഡ്‌ലൈൻ: സെപ്റ്റംബർ 20 (7 ദിവസങ്ങൾ)\n• GSTR-1 ഡെഡ്‌ലൈൻ: സെപ്റ്റംബർ 11 (Filed)\n\nഇനി ദിവസേനയുള്ള വിൽപ്പന രേഖപ്പെടുത്താൻ 'Innu 60 chaya vittu' എന്ന് വോയ്സ് നോട്ട് അയക്കാം. കട അടയ്ക്കുമ്പോൾ 'Close shop for today' എന്ന് പറഞ്ഞാൽ ക്ലോസിംഗ് PDF റിപ്പോർട്ട് ലഭിക്കും.`,
      Tamil: `ஜிஎஸ்டி எண் (${detectedGstin}) சரிபார்க்கப்பட்டு பதிவு செய்யப்பட்டது!\n\nஉங்கள் கடை பதிவு வெற்றிகரமாக முடிந்தது!\n• GSTR-3B நினைவூட்டல்: செப்டம்பர் 20\n• GSTR-1 நினைவூட்டல்: செப்டம்பர் 11\n\nவிற்பனை பதிவு செய்ய வாய்ஸ் மெசேஜ் அனுப்புங்கள் (எ.கா: 'Innaiku 50 tea vithen').`,
      Hindi: `जीएसटीआईएन (${detectedGstin}) सफलतापूर्वक दर्ज और सत्यापित हुआ!\n\nआपकी दुकान का ऑनबोर्डिंग पूरा हो गया!\n• GSTR-3B डेडलाइन: 20 सितंबर (7 दिन शेष)\n• GSTR-1 डेडलाइन: 11 सितंबर (Filed)\n\nअब आप सीधे बोलकर बिक्री दर्ज कर सकते हैं (जैसे: 'Innu 60 chaya vittu'), स्टॉक पूछ सकते हैं, या दुकान बंद करने के लिए 'Close shop for today' बोल सकते हैं।`,
      English: `GSTIN ${detectedGstin} verified and stored!\n\n*Your store onboarding is complete!*\n• *GSTR-3B Deadline:* 20 Sep 2026 (7 days left)\n• *GSTR-1 Deadline:* 11 Sep 2026 (Filed)\n• *Daily Sales:* Send voice notes like 'Sold 50 teas at 15 rupees'\n• *Store Close:* Send 'Close shop for today' to receive your daily PDF report.`,
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        text: gstinReplyByLang[detectedLang],
        card: {
          title: "Store Onboarded & Active",
          badge: "Active",
          rows: [
            { label: "GSTIN", value: detectedGstin, strong: true },
            { label: "Return Frequency", value: "Monthly Regular" },
            { label: "Next Deadline", value: "GSTR-3B · 20 Sep 2026 (7 days left)" },
            { label: "Estimated Liability", value: "₹3,450 (Auto-calculated)" },
            { label: "Alert Schedule", value: "Notifications 5, 3 and 1 day before" },
          ],
          footnote: "Compliant with GSTN rules · Store is live on WhatsApp",
        },
      },
      updatedMemory,
    };
  }

  // 4. Daily Report / Close Shop / EOD Intent
  const isCloseShopOrReport =
    /(close shop|kadai close|kada adachu|dukaan bandh|band karo|daily report|closing report|pdf report|send report|eod|closing statement|today's report|aaj ka hisab)/i.test(
      lower
    );

  if (isCloseShopOrReport) {
    const textByLang: Record<SupportedLanguage, string> = {
      Malayalam: `ഇന്നത്തെ കട ക്ലോസ് ചെയ്തു. ഇന്നത്തെ ലാഭം ₹${updatedMemory.today.profit.toLocaleString(
        "en-IN"
      )}. പൂർണ്ണമായ ഡെയ്‌ലി ക്ലോസിംഗ് റിപ്പോർട്ട് PDF ആയി താഴെ നൽകിയിട്ടുണ്ട്.`,
      Tamil: `இன்றைய கடை மூடப்பட்டது. இன்றைய நிகர லாபம் ₹${updatedMemory.today.profit.toLocaleString(
        "en-IN"
      )}. முழு தினசரி PDF அறிக்கை கீழே இணைக்கப்பட்டுள்ளது.`,
      Hindi: `दुकान क्लोजिंग पूरी हुई। आज का कुल मुनाफा ₹${updatedMemory.today.profit.toLocaleString(
        "en-IN"
      )} रहा। आपका दैनिक क्लोजिंग PDF स्टेटमेंट नीचे तैयार है।`,
      English: `Store closing recorded. Today's Net Profit is ₹${updatedMemory.today.profit.toLocaleString(
        "en-IN"
      )}. Your official Daily Closing PDF statement is attached below.`,
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        text: textByLang[detectedLang],
        document: {
          fileName: `BizzBrain_Daily_Report_13Sep.pdf`,
          fileSize: "148 KB",
          fileType: "pdf",
          title: "Daily Closing Statement",
          date: "13 Sep 2026 · EOD Closure",
          summary: {
            revenue: updatedMemory.today.revenue,
            expenses: updatedMemory.today.expenses,
            profit: updatedMemory.today.profit,
            entriesCount: updatedMemory.today.entriesCount,
          },
        },
      },
      updatedMemory,
    };
  }

  // 5. Stock / Inventory Inquiry Intent (Evaluated before profit)
  const isStock =
    /(stock|sugar|cheeni|chini|panchasara|sarkarai|milk|paal|tea powder|chai patti|kitna bacha|ethra baki|evlo irukku|bacha hai|left|remaining)/i.test(
      lower
    );

  if (isStock) {
    const isSugarSpecific = /(sugar|cheeni|chini|panchasara|sarkarai)/i.test(lower);

    if (isSugarSpecific) {
      const sugarNoticeByLang: Record<SupportedLanguage, string> = {
        Hindi:
          "शुगर स्टॉक कम है — सिर्फ 4 kg बचा है! कल सुबह दुकान खोलने से पहले कम से कम 10 kg री-ऑर्डर कर लीजिए। दूध (28 L) और चाय पत्ती (9 kg) पर्याप्त हैं।",
        Malayalam:
          "പഞ്ചസാര (Sugar) സ്റ്റോക്ക് കുറവാണ് — 4 kg മാത്രമേ ബാക്കിയുള്ളൂ! നാളെ രാവിലെ കട തുറക്കുന്നതിന് മുൻപ് കുറഞ്ഞത് 10 kg റീ-ഓർഡർ ചെയ്യണം.",
        Tamil:
          "சர்க்கரை (Sugar) ஸ்டாக் கம்மியா இருக்கு — 4 kg தான் மிச்சம் இருக்கு! நாளை காலை கடை திறப்பதற்கு முன் 10 kg வாங்க வேண்டும்.",
        English:
          "Sugar stock is running low — only 4 kg left! Please reorder at least 10 kg before opening tomorrow morning.",
      };

      return {
        detectedLang,
        transcript: rawTranscript,
        nativeScript: options?.nativeScript,
        seconds,
        audioUrl,
        botReply: {
          text: sugarNoticeByLang[detectedLang],
          card: {
            title: "Stock Alert: Sugar",
            badge: "Low (4 kg left)",
            rows: [
              { label: "Sugar", value: "4 kg available", strong: true },
              { label: "Safety Level", value: "10 kg minimum" },
              { label: "Action Required", value: "Reorder before tomorrow morning" },
              { label: "Milk", value: "28 Litres (Normal)" },
              { label: "Tea Powder", value: "9 kg (Normal)" },
            ],
            footnote: "Stock check updated from Business Memory · Low stock alert active",
          },
        },
        updatedMemory,
      };
    }

    // General stock check
    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        card: {
          title: "Store Inventory Status",
          badge: "Live Check",
          rows: [
            { label: "Sugar", value: "4 kg — Low Stock Alert", strong: true },
            { label: "Milk", value: "28 Litres" },
            { label: "Tea Powder", value: "9 kg" },
            { label: "Coffee Powder", value: "5 kg" },
          ],
          footnote: "Sugar reorder needed before opening tomorrow morning",
        },
      },
      updatedMemory,
    };
  }

  // 6. Sales Intent (handles keywords like 'sold/vittu/becha' as well as shorthand '5 vada', '2 tea', etc.)
  const knownFoodItemPattern =
    /(vada|vadai|tea|chai|chaya|coffee|kaapi|samosa|dosa|biscuit|bun|puff|snack|cake|bread|sweet|halwa|juice)/i;
  const isSaleKeyword = /(vittu|vithen|becha|sold|sale|bikri|order|billed)/i.test(lower);
  const isFoodWithQuantity =
    knownFoodItemPattern.test(lower) &&
    (/\d+/.test(lower) || /\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i.test(lower));

  const isSale =
    (isSaleKeyword || isFoodWithQuantity) &&
    !/(stock|kitna bacha|ethra baki|evlo irukku|baki dena|kodukkanam|pay|due|kadan)/i.test(
      lower
    );

  if (isSale) {
    let itemName = "Tea (Chaya)";
    let defaultRate = 15;

    if (/vada|vadai/i.test(lower)) {
      itemName = "Medhu Vada";
      defaultRate = 10;
    } else if (/samosa/i.test(lower)) {
      itemName = "Hot Samosa";
      defaultRate = 20;
    } else if (/coffee|kaapi/i.test(lower)) {
      itemName = "Filter Coffee";
      defaultRate = 25;
    } else if (/dosa/i.test(lower)) {
      itemName = "Masala Dosa";
      defaultRate = 60;
    } else if (/chaya/i.test(lower)) {
      itemName = "Tea (Chaya)";
      defaultRate = 15;
    } else if (/tea|chai/i.test(lower)) {
      itemName = "Tea (Chaya)";
      defaultRate = 15;
    }

    // Dynamic catalog lookup if item exists in store catalog
    const catalogMatch = (updatedMemory.menuCatalog ?? []).find(
      (m) =>
        m.name.toLowerCase().includes(itemName.toLowerCase()) ||
        itemName.toLowerCase().includes(m.name.toLowerCase()) ||
        lower.includes(m.name.toLowerCase())
    );
    if (catalogMatch) {
      itemName = catalogMatch.name;
      defaultRate = catalogMatch.rate;
    }

    const normalizedText = lower
      .replace(/\bone\b/gi, "1")
      .replace(/\btwo\b/gi, "2")
      .replace(/\bthree\b/gi, "3")
      .replace(/\bfour\b/gi, "4")
      .replace(/\bfive\b/gi, "5")
      .replace(/\bsix\b/gi, "6")
      .replace(/\bseven\b/gi, "7")
      .replace(/\beight\b/gi, "8")
      .replace(/\bnine\b/gi, "9")
      .replace(/\bten\b/gi, "10");

    let qty = 1;
    let rate = defaultRate;

    const nums = (normalizedText.match(/\d+/g) ?? []).map(Number);
    const n0 = nums[0];
    const n1 = nums[1];
    if (n0 !== undefined && n1 !== undefined) {
      qty = n0;
      rate = n1;
    } else if (n0 !== undefined) {
      qty = n0;
      rate = defaultRate;
    }

    const total = qty * rate;

    const newRevenue = updatedMemory.today.revenue + total;
    const newProfit = newRevenue - updatedMemory.today.expenses;
    const newEntries = updatedMemory.today.entriesCount + 1;

    const existingItemIndex = updatedMemory.topItems.findIndex((it) =>
      it.name.toLowerCase().includes(itemName.toLowerCase()) ||
      itemName.toLowerCase().includes(it.name.toLowerCase())
    );
    const newTopItems = [...updatedMemory.topItems];
    if (existingItemIndex >= 0) {
      const it = newTopItems[existingItemIndex];
      if (it) {
        const newCount = it.count + qty;
        newTopItems[existingItemIndex] = {
          name: it.name,
          count: newCount,
          quantity: `${newCount} ${
            itemName.includes("Tea") || itemName.includes("Coffee") ? "cups" : "pcs"
          }`,
          pct: Math.min(100, Math.round((newCount / 250) * 100)),
        };
      }
    } else {
      newTopItems.push({
        name: itemName,
        count: qty,
        quantity: `${qty} pcs`,
        pct: Math.min(100, Math.round((qty / 250) * 100)),
      });
    }

    updatedMemory = {
      ...updatedMemory,
      today: {
        ...updatedMemory.today,
        revenue: newRevenue,
        profit: newProfit,
        entriesCount: newEntries,
      },
      topItems: newTopItems,
    };

    const footnoteByLang: Record<SupportedLanguage, string> = {
      Malayalam: "ബിസിനസ് മെമ്മറിയിൽ ചേർത്തു · Today's Sales updated",
      Tamil: "விற்பனை பதிவாகியது · Added to today's sales",
      Hindi: "बिक्री दर्ज की गई · Added to today's sales",
      English: "Sale recorded · Added to today's sales",
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        card: {
          title: "Sale recorded",
          badge: "Recorded",
          rows: [
            { label: "Item", value: `${itemName} × ${qty}` },
            { label: "Rate", value: `₹${rate}` },
            { label: "Total", value: `₹${total.toLocaleString("en-IN")}`, strong: true },
          ],
          footnote: footnoteByLang[detectedLang],
        },
      },
      updatedMemory,
    };
  }

  // 7. Pending Dues / Payables Intent
  const isDue = /(kodukkanam|pay|pannanum|dena|due|kadan|udhaar|pending|baki dena)/i.test(lower);

  if (isDue) {
    let partyName = "Supplier";
    let amount = 35000;
    let dueTime = "Next week";

    if (/kunjumon/i.test(lower)) partyName = "Kunjumon — Provisions";
    else if (/murugan/i.test(lower)) partyName = "Murugan — Supplier";
    else if (/sharma/i.test(lower)) partyName = "Sharma Ji — Supplier";
    else if (/landlord|rent/i.test(lower)) partyName = "Shop Landlord (Rent)";
    else if (/milk/i.test(lower)) partyName = "Milk Vendor";

    const nums = rawTranscript.match(/\d+[\d,kK]*/g);
    const rawNumStr = nums?.[0];
    if (rawNumStr) {
      const rawNum = rawNumStr.toLowerCase().replace(/,/g, "");
      if (rawNum.endsWith("k")) {
        amount = parseFloat(rawNum) * 1000;
      } else {
        amount = parseInt(rawNum, 10);
      }
    }

    if (/adutha aazhcha|next week|agle hafte/i.test(lower)) {
      dueTime = "Next week · Reminder set";
    } else if (/friday|monday|thursday/i.test(lower)) {
      dueTime = "This Friday · Reminder set";
    }

    const newDues = [
      {
        id: `due-${Date.now()}`,
        name: partyName,
        amount,
        due: dueTime,
      },
      ...updatedMemory.dues,
    ];

    updatedMemory = {
      ...updatedMemory,
      dues: newDues,
    };

    const footnoteByLang: Record<SupportedLanguage, string> = {
      Malayalam: "ഓർമ്മിച്ചു. ബിസിനസ് മെമ്മറിയിൽ സൂക്ഷിച്ചു",
      Tamil: "நினைவில் வைக்கப்பட்டது. நினைவூட்டல் அமைக்கப்பட்டது",
      Hindi: "याद रखा गया. अनुस्मारक सेट किया गया",
      English: "Remembered. Saved to Business Memory with alert",
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        card: {
          title: "Remembered",
          badge: "Pending",
          rows: [
            { label: "Party", value: partyName },
            { label: "Amount", value: `₹${amount.toLocaleString("en-IN")}`, strong: true },
            { label: "Due", value: dueTime },
          ],
          footnote: footnoteByLang[detectedLang],
        },
      },
      updatedMemory,
    };
  }

  // 8. Profit Inquiry Intent
  const isProfit =
    /(profit|laabham|laabh|kamayi|fayda|net profit|earnings|profit evlo|profit kitna|kitna profit|laabham ethraya)/i.test(
      lower
    );

  if (isProfit) {
    const titlesByLang: Record<SupportedLanguage, string> = {
      Malayalam: "ഇന്നത്തെ ലാഭം (Today's Profit)",
      Tamil: "இன்றைய லாபம் (Today's Profit)",
      Hindi: "आज का लाभ (Today's Profit)",
      English: "Today's Profit",
    };

    return {
      detectedLang,
      transcript: rawTranscript,
      nativeScript: options?.nativeScript,
      seconds,
      audioUrl,
      botReply: {
        card: {
          title: titlesByLang[detectedLang],
          rows: [
            { label: "Revenue", value: `₹${updatedMemory.today.revenue.toLocaleString("en-IN")}` },
            { label: "Expenses", value: `₹${updatedMemory.today.expenses.toLocaleString("en-IN")}` },
            {
              label: "Net Profit",
              value: `₹${updatedMemory.today.profit.toLocaleString("en-IN")}`,
              strong: true,
            },
          ],
          footnote: `${updatedMemory.today.entriesCount} entries calculated from voice and text`,
        },
      },
      updatedMemory,
    };
  }

  // Fallback conversational reply
  const fallbackByLang: Record<SupportedLanguage, string> = {
    Malayalam:
      "മനസ്സിലായി. ഞാൻ ബിസിനസ് മെമ്മറിയിൽ സേവ് ചെയ്തു. വിൽപ്പന, പേയ്മെന്റ്, സ്റ്റോക്ക് അതോ ഇന്നത്തെ ക്ലോസിംഗ് റിപ്പോർട്ടാണോ അറിയേണ്ടത്?",
    Tamil:
      "புரிஞ்சிடுச்சு. பிசினஸ் மெமரில சேவ் பண்ணிட்டேன். விற்பனை, பேமென்ட், ஸ்டாக் அல்லது தினசரி அறிக்கை வேணுமா?",
    Hindi:
      "समझ गया. मैंने इसे बिज़नेस मेमोरी में नोट कर लिया है। बताइए — बिक्री, भुगतान, स्टॉक चेक या दुकान बंद करके डेली रिपोर्ट चाहिए?",
    English:
      "Understood. Noted in Business Memory. Would you like to record a sale, check sugar stock, or close the shop for today's daily report?",
  };

  return {
    detectedLang,
    transcript: rawTranscript,
    nativeScript: options?.nativeScript,
    seconds,
    audioUrl,
    botReply: {
      text: fallbackByLang[detectedLang],
    },
    updatedMemory,
  };
}
