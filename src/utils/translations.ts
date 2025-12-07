// Translation keys and their values in different languages
export type Language = 'English' | 'Hindi' | 'Gujarati' | 'Marathi' | 'Bengali' | 'Tamil' | 'Telugu' | 'Kannada' | 'Malayalam' | 'Punjabi' | 'Urdu';

export interface Translations {
  // Home Screen
  greeting: string;
  day: string;
  week: string;
  month: string;
  pending: string;
  confirmed: string;
  completed: string;
  
  // Menu
  orders: string;
  schedule: string;
  setting: string;
  
  // Settings Screen
  settings: string;
  userProfile: string;
  location: string;
  appLanguage: string;
  inviteFriend: string;
  tutorialVideos: string;
  help: string;
  
  // Order Screens
  orderHistory: string;
  activeOrder: string;
  client: string;
  status: string;
  address: string;
  phone: string;
  openMap: string;
  enterOTP: string;
  reschedule: string;
  cancel: string;
  
  // Reschedule Flow
  rescheduleYourWorker: string;
  scheduleTime: string;
  commentForCancel: string;
  commentForReschedule: string;
  previous: string;
  next: string;
  
  // Schedule Screens
  weeklySchedule: string;
  monthlySchedule: string;
  
  // Common
  search: string;
  verify: string;
  retry: string;
  close: string;
  update: string;
  save: string;
  sendEmail: string;
  
  // FAQ
  faq1Question: string;
  faq1Answer: string;
  faq2Question: string;
  faq2Answer: string;
  faq3Question: string;
  faq3Answer: string;
  faq4Question: string;
  faq4Answer: string;
  faq5Question: string;
  faq5Answer: string;
  faq6Question: string;
  faq6Answer: string;
  
  // Days of week
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  
  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
}

export const translations: Record<Language, Translations> = {
  English: {
    greeting: 'Hello',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    orders: 'Orders',
    schedule: 'Schedule',
    setting: 'Setting',
    settings: 'Settings',
    userProfile: 'User Profile',
    location: 'Location',
    appLanguage: 'App Language',
    inviteFriend: 'Invite Friend',
    tutorialVideos: 'Tutorial Videos',
    help: 'Help',
    orderHistory: 'Order History',
    activeOrder: 'Order',
    client: 'Client',
    status: 'Status',
    address: 'Address',
    phone: 'Phone',
    openMap: 'Open MAP',
    enterOTP: 'Enter OTP',
    reschedule: 'Reschedule',
    cancel: 'Cancel',
    rescheduleYourWorker: 'Reschedule Your Worker',
    scheduleTime: 'Schedule Time',
    commentForCancel: 'Comment For Cancel',
    commentForReschedule: 'Comment For Reschedule',
    previous: 'previous',
    next: 'Next',
    weeklySchedule: 'Weekly Schedule',
    monthlySchedule: 'Monthly Schedule',
    search: 'Search',
    verify: 'Verify',
    retry: 'Retry',
    close: 'Close',
    update: 'Update',
    save: 'Save',
    sendEmail: 'Send Email',
    faq1Question: 'How To Withdraw Money ?',
    faq1Answer: 'To withdraw money:\n1. Go to your Profile\n2. Click on "Withdraw Funds"\n3. Enter the amount (minimum ₹100)\n4. Select your bank account\n5. Confirm the withdrawal\n\nMoney will be transferred within 24-48 hours.',
    faq2Question: 'How TO Get More Work ?',
    faq2Answer: 'To get more work:\n1. Complete your profile 100%\n2. Add skills and portfolio images\n3. Set competitive rates\n4. Enable location services\n5. Keep availability updated\n6. Maintain high ratings\n\nHigher ratings = More visibility!',
    faq3Question: 'How TO Schedule Non-Working Day ?',
    faq3Answer: 'To schedule non-working days:\n1. Go to your Profile\n2. Click "Availability Calendar"\n3. Select dates you\'re unavailable\n4. Add reason (optional)\n5. Save changes\n\nClients won\'t see you on blocked dates.',
    faq4Question: 'How TO Get Help From AI ?',
    faq4Answer: 'To get AI help:\n1. Click the AI button (bottom-right)\n2. Type your question\n3. AI will respond instantly\n\nAI can help with:\n• Withdrawals\n• Getting work\n• Scheduling\n• Bank setup\n• Referrals\n• And more!',
    faq5Question: 'How To Set Primary Bank Account ?',
    faq5Answer: 'To set primary bank account:\n1. Go to Settings\n2. Click "Bank Accounts"\n3. Click "Add Bank Account"\n4. Enter bank details\n5. Click "Set as Primary"\n\nYou can add multiple accounts and switch primary anytime.',
    faq6Question: 'Benefits Of Inviting Friends ?',
    faq6Answer: 'Referral benefits:\n• You earn ₹100 when friend signs up\n• Your friend gets ₹50 bonus\n• Unlimited referrals allowed\n• Instant rewards\n• Help friends earn too!\n\nShare your code from Settings → Invite A Friend',
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
  Hindi: {
    greeting: 'नमस्ते',
    day: 'दिन',
    week: 'सप्ताह',
    month: 'महीना',
    pending: 'लंबित',
    confirmed: 'पुष्टि',
    completed: 'पूर्ण',
    orders: 'ऑर्डर',
    schedule: 'अनुसूची',
    setting: 'सेटिंग',
    settings: 'सेटिंग्स',
    userProfile: 'उपयोगकर्ता प्रोफ़ाइल',
    location: 'स्थान',
    appLanguage: 'ऐप भाषा',
    inviteFriend: 'मित्र को आमंत्रित करें',
    tutorialVideos: 'ट्यूटोरियल वीडियो',
    help: 'मदद',
    orderHistory: 'ऑर्डर इतिहास',
    activeOrder: 'ऑर्डर',
    client: 'ग्राहक',
    status: 'स्थिति',
    address: 'पता',
    phone: 'फोन',
    openMap: 'मानचित्र खोलें',
    enterOTP: 'OTP दर्ज करें',
    reschedule: 'पुनर्निर्धारित करें',
    cancel: 'रद्द करें',
    rescheduleYourWorker: 'अपने कार्यकर्ता को पुनर्निर्धारित करें',
    scheduleTime: 'समय निर्धारित करें',
    commentForCancel: 'रद्द करने के लिए टिप्पणी',
    commentForReschedule: 'पुनर्निर्धारण के लिए टिप्पणी',
    previous: 'पिछला',
    next: 'अगला',
    weeklySchedule: 'साप्ताहिक अनुसूची',
    monthlySchedule: 'मासिक अनुसूची',
    search: 'खोजें',
    verify: 'सत्यापित करें',
    retry: 'पुनः प्रयास करें',
    close: 'बंद करें',
    update: 'अपडेट करें',
    save: 'सहेजें',
    sendEmail: 'ईमेल भेजें',
    faq1Question: 'पैसे कैसे निकालें?',
    faq1Answer: 'पैसे निकालने के लिए:\n1. अपनी प्रोफाइल पर जाएं\n2. "धनराशि निकालें" पर क्लिक करें\n3. राशि दर्ज करें (न्यूनतम ₹100)\n4. अपना बैंक खाता चुनें\n5. निकासी की पुष्टि करें\n\nपैसा 24-48 घंटों में स्थानांतरित हो जाएगा।',
    faq2Question: 'अधिक काम कैसे प्राप्त करें?',
    faq2Answer: 'अधिक काम पाने के लिए:\n1. अपनी प्रोफाइल 100% पूर्ण करें\n2. कौशल और पोर्टफोलियो चित्र जोड़ें\n3. प्रतिस्पर्धी दरें निर्धारित करें\n4. स्थान सेवाएं सक्षम करें\n5. उपलब्धता अपडेट रखें\n6. उच्च रेटिंग बनाए रखें\n\nउच्च रेटिंग = अधिक दृश्यता!',
    faq3Question: 'गैर-कार्य दिवस कैसे निर्धारित करें?',
    faq3Answer: 'गैर-कार्य दिवस निर्धारित करने के लिए:\n1. अपनी प्रोफाइल पर जाएं\n2. "उपलब्धता कैलेंडर" पर क्लिक करें\n3. वे तारीखें चुनें जब आप उपलब्ध नहीं हैं\n4. कारण जोड़ें (वैकल्पिक)\n5. परिवर्तन सहेजें\n\nग्राहक अवरुद्ध तारीखों पर आपको नहीं देखेंगे।',
    faq4Question: 'AI से मदद कैसे प्राप्त करें?',
    faq4Answer: 'AI मदद पाने के लिए:\n1. AI बटन पर क्लिक करें (नीचे-दाएं)\n2. अपना प्रश्न टाइप करें\n3. AI तुरंत जवाब देगा\n\nAI मदद कर सकता है:\n• निकासी\n• काम प्राप्त करना\n• शेड्यूलिंग\n• बैंक सेटअप\n• रेफरल\n• और अधिक!',
    faq5Question: 'प्राथमिक बैंक खाता कैसे सेट करें?',
    faq5Answer: 'प्राथमिक बैंक खाता सेट करने के लिए:\n1. सेटिंग्स पर जाएं\n2. "बैंक खाते" पर क्लिक करें\n3. "बैंक खाता जोड़ें" पर क्लिक करें\n4. बैंक विवरण दर्ज करें\n5. "प्राथमिक के रूप में सेट करें" पर क्लिक करें\n\nआप कई खाते जोड़ सकते हैं और कभी भी प्राथमिक बदल सकते हैं।',
    faq6Question: 'दोस्तों को आमंत्रित करने के लाभ?',
    faq6Answer: 'रेफरल लाभ:\n• दोस्त साइन अप करने पर आपको ₹100 मिलते हैं\n• आपके दोस्त को ₹50 बोनस मिलता है\n• असीमित रेफरल की अनुमति\n• तत्काल पुरस्कार\n• दोस्तों को भी कमाने में मदद करें!\n\nसेटिंग्स → मित्र को आमंत्रित करें से अपना कोड साझा करें',
    sunday: 'रविवार',
    monday: 'सोमवार',
    tuesday: 'मंगलवार',
    wednesday: 'बुधवार',
    thursday: 'गुरुवार',
    friday: 'शुक्रवार',
    saturday: 'शनिवार',
    january: 'जनवरी',
    february: 'फरवरी',
    march: 'मार्च',
    april: 'अप्रैल',
    may: 'मई',
    june: 'जून',
    july: 'जुलाई',
    august: 'अगस्त',
    september: 'सितंबर',
    october: 'अक्टूबर',
    november: 'नवंबर',
    december: 'दिसंबर',
  },
  Gujarati: {
    greeting: 'નમસ્તે',
    day: 'દિવસ',
    week: 'અઠવાડિયું',
    month: 'મહિનો',
    pending: 'બાકી',
    confirmed: 'પુષ્ટિ',
    completed: 'પૂર્ણ',
    orders: 'ઓર્ડર',
    schedule: 'સમયપત્રક',
    setting: 'સેટિંગ',
    settings: 'સેટિંગ્સ',
    userProfile: 'વપરાશકર્તા પ્રોફાઇલ',
    location: 'સ્થાન',
    appLanguage: 'એપ ભાષા',
    inviteFriend: 'મિત્રને આમંત્રિત કરો',
    tutorialVideos: 'ટ્યુટોરિયલ વિડિઓઝ',
    help: 'મદદ',
    orderHistory: 'ઓર્ડર ઇતિહાસ',
    activeOrder: 'ઓર્ડર',
    client: 'ગ્રાહક',
    status: 'સ્થિતિ',
    address: 'સરનામું',
    phone: 'ફોન',
    openMap: 'નકશો ખોલો',
    enterOTP: 'OTP દાખલ કરો',
    reschedule: 'ફરીથી સમય નક્કી કરો',
    cancel: 'રદ કરો',
    rescheduleYourWorker: 'તમારા કાર્યકરને ફરીથી સમય નક્કી કરો',
    scheduleTime: 'સમય નક્કી કરો',
    commentForCancel: 'રદ કરવા માટે ટિપ્પણી',
    commentForReschedule: 'ફરીથી સમય નક્કી કરવા માટે ટિપ્પણી',
    previous: 'પાછલું',
    next: 'આગળ',
    weeklySchedule: 'સાપ્તાહિક સમયપત્રક',
    monthlySchedule: 'માસિક સમયપત્રક',
    search: 'શોધો',
    verify: 'ચકાસો',
    retry: 'ફરી પ્રયાસ કરો',
    close: 'બંધ કરો',
    update: 'અપડેટ કરો',
    save: 'સાચવો',
    sendEmail: 'ઈમેલ મોકલો',
    faq1Question: 'How To Withdraw Money ?',
    faq1Answer: 'To withdraw money:\n1. Go to your Profile\n2. Click on "Withdraw Funds"\n3. Enter the amount (minimum ₹100)\n4. Select your bank account\n5. Confirm the withdrawal\n\nMoney will be transferred within 24-48 hours.',
    faq2Question: 'How TO Get More Work ?',
    faq2Answer: 'To get more work:\n1. Complete your profile 100%\n2. Add skills and portfolio images\n3. Set competitive rates\n4. Enable location services\n5. Keep availability updated\n6. Maintain high ratings\n\nHigher ratings = More visibility!',
    faq3Question: 'How TO Schedule Non-Working Day ?',
    faq3Answer: 'To schedule non-working days:\n1. Go to your Profile\n2. Click "Availability Calendar"\n3. Select dates you\'re unavailable\n4. Add reason (optional)\n5. Save changes\n\nClients won\'t see you on blocked dates.',
    faq4Question: 'How TO Get Help From AI ?',
    faq4Answer: 'To get AI help:\n1. Click the AI button (bottom-right)\n2. Type your question\n3. AI will respond instantly\n\nAI can help with:\n• Withdrawals\n• Getting work\n• Scheduling\n• Bank setup\n• Referrals\n• And more!',
    faq5Question: 'How To Set Primary Bank Account ?',
    faq5Answer: 'To set primary bank account:\n1. Go to Settings\n2. Click "Bank Accounts"\n3. Click "Add Bank Account"\n4. Enter bank details\n5. Click "Set as Primary"\n\nYou can add multiple accounts and switch primary anytime.',
    faq6Question: 'Benefits Of Inviting Friends ?',
    faq6Answer: 'Referral benefits:\n• You earn ₹100 when friend signs up\n• Your friend gets ₹50 bonus\n• Unlimited referrals allowed\n• Instant rewards\n• Help friends earn too!\n\nShare your code from Settings → Invite A Friend',
    sunday: 'રવિવાર',
    monday: 'સોમવાર',
    tuesday: 'મંગળવાર',
    wednesday: 'બુધવાર',
    thursday: 'ગુરુવાર',
    friday: 'શુક્રવાર',
    saturday: 'શનિવાર',
    january: 'જાન્યુઆરી',
    february: 'ફેબ્રુઆરી',
    march: 'માર્ચ',
    april: 'એપ્રિલ',
    may: 'મે',
    june: 'જૂન',
    july: 'જુલાઈ',
    august: 'ઓગસ્ટ',
    september: 'સપ્ટેમ્બર',
    october: 'ઓક્ટોબર',
    november: 'નવેમ્બર',
    december: 'ડિસેમ્બર',
  },
  // Add more languages with same structure
  Marathi: {
    greeting: 'नमस्कार',
    day: 'दिवस',
    week: 'आठवडा',
    month: 'महिना',
    pending: 'प्रलंबित',
    confirmed: 'पुष्टी',
    completed: 'पूर्ण',
    orders: 'ऑर्डर',
    schedule: 'वेळापत्रक',
    setting: 'सेटिंग',
    settings: 'सेटिंग्ज',
    userProfile: 'वापरकर्ता प्रोफाइल',
    location: 'स्थान',
    appLanguage: 'अॅप भाषा',
    inviteFriend: 'मित्राला आमंत्रित करा',
    tutorialVideos: 'ट्यूटोरियल व्हिडिओ',
    help: 'मदत',
    orderHistory: 'ऑर्डर इतिहास',
    activeOrder: 'ऑर्डर',
    client: 'ग्राहक',
    status: 'स्थिती',
    address: 'पत्ता',
    phone: 'फोन',
    openMap: 'नकाशा उघडा',
    enterOTP: 'OTP प्रविष्ट करा',
    reschedule: 'पुनर्निर्धारित करा',
    cancel: 'रद्द करा',
    rescheduleYourWorker: 'तुमच्या कामगाराला पुनर्निर्धारित करा',
    scheduleTime: 'वेळ निश्चित करा',
    commentForCancel: 'रद्द करण्यासाठी टिप्पणी',
    commentForReschedule: 'पुनर्निर्धारणासाठी टिप्पणी',
    previous: 'मागील',
    next: 'पुढे',
    weeklySchedule: 'साप्ताहिक वेळापत्रक',
    monthlySchedule: 'मासिक वेळापत्रक',
    search: 'शोधा',
    verify: 'सत्यापित करा',
    retry: 'पुन्हा प्रयत्न करा',
    close: 'बंद करा',
    update: 'अद्यतनित करा',
    save: 'जतन करा',
    sendEmail: 'ईमेल पाठवा',
    faq1Question: 'How To Withdraw Money ?',
    faq1Answer: 'To withdraw money:\n1. Go to your Profile\n2. Click on "Withdraw Funds"\n3. Enter the amount (minimum ₹100)\n4. Select your bank account\n5. Confirm the withdrawal\n\nMoney will be transferred within 24-48 hours.',
    faq2Question: 'How TO Get More Work ?',
    faq2Answer: 'To get more work:\n1. Complete your profile 100%\n2. Add skills and portfolio images\n3. Set competitive rates\n4. Enable location services\n5. Keep availability updated\n6. Maintain high ratings\n\nHigher ratings = More visibility!',
    faq3Question: 'How TO Schedule Non-Working Day ?',
    faq3Answer: 'To schedule non-working days:\n1. Go to your Profile\n2. Click "Availability Calendar"\n3. Select dates you\'re unavailable\n4. Add reason (optional)\n5. Save changes\n\nClients won\'t see you on blocked dates.',
    faq4Question: 'How TO Get Help From AI ?',
    faq4Answer: 'To get AI help:\n1. Click the AI button (bottom-right)\n2. Type your question\n3. AI will respond instantly\n\nAI can help with:\n• Withdrawals\n• Getting work\n• Scheduling\n• Bank setup\n• Referrals\n• And more!',
    faq5Question: 'How To Set Primary Bank Account ?',
    faq5Answer: 'To set primary bank account:\n1. Go to Settings\n2. Click "Bank Accounts"\n3. Click "Add Bank Account"\n4. Enter bank details\n5. Click "Set as Primary"\n\nYou can add multiple accounts and switch primary anytime.',
    faq6Question: 'Benefits Of Inviting Friends ?',
    faq6Answer: 'Referral benefits:\n• You earn ₹100 when friend signs up\n• Your friend gets ₹50 bonus\n• Unlimited referrals allowed\n• Instant rewards\n• Help friends earn too!\n\nShare your code from Settings → Invite A Friend',
    sunday: 'रविवार',
    monday: 'सोमवार',
    tuesday: 'मंगळवार',
    wednesday: 'बुधवार',
    thursday: 'गुरुवार',
    friday: 'शुक्रवार',
    saturday: 'शनिवार',
    january: 'जानेवारी',
    february: 'फेब्रुवारी',
    march: 'मार्च',
    april: 'एप्रिल',
    may: 'मे',
    june: 'जून',
    july: 'जुलै',
    august: 'ऑगस्ट',
    september: 'सप्टेंबर',
    october: 'ऑक्टोबर',
    november: 'नोव्हेंबर',
    december: 'डिसेंबर',
  },
  // Placeholder for other languages - use English as fallback
  Bengali: {} as Translations,
  Tamil: {} as Translations,
  Telugu: {} as Translations,
  Kannada: {} as Translations,
  Malayalam: {} as Translations,
  Punjabi: {} as Translations,
  Urdu: {} as Translations,
};

// Fill in missing languages with English as fallback
const englishTranslations = translations.English;
(['Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'] as Language[]).forEach(lang => {
  translations[lang] = { ...englishTranslations };
});

export const getTranslation = (language: Language, key: keyof Translations): string => {
  return translations[language]?.[key] || translations.English[key] || key;
};
