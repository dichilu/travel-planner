import React, { useState, useRef } from 'react';
import { 
  PlaneTakeoff, MapPin, Calendar, Users, Wallet, Activity, 
  Bed, Train, Coffee, Printer, ExternalLink, AlertCircle, 
  Compass, Ticket, Loader2, Navigation, Image as ImageIcon,
  Car, Info, CheckCircle2, Map, Sparkles, ArrowRight, Clock,
  Globe, Trash2, RefreshCw, Download, Check, MapPinned
} from 'lucide-react';

// --- 全域應用程式版號 ---
const APP_VERSION = "v1.21.1 - 修復 Tailwind v4 相容性與樣式加載錯誤";

const bgImages = {
  "Taiwan": "https://images.unsplash.com/photo-1504233529578-6d46baba6d3f?q=80&w=2000&auto=format&fit=crop",
  "Japan": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
  "South Korea": "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=2000&auto=format&fit=crop",
  "Southeast Asia": "https://images.unsplash.com/photo-1528181304800-2f140819ad52?q=80&w=2000&auto=format&fit=crop",
  "Americas": "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=2000&auto=format&fit=crop",
  "Europe": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2000&auto=format&fit=crop",
  "Oceania": "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2000&auto=format&fit=crop",
  "HK/MO/CN": "https://images.unsplash.com/photo-1513623935135-c896b59073c1?q=80&w=2000&auto=format&fit=crop",

  "Taipei": "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=2000&auto=format&fit=crop",
  "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop",
  "Osaka": "https://images.unsplash.com/photo-1590222047805-4c07baf0a30b?q=80&w=2000&auto=format&fit=crop",
  "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
  "Hokkaido": "https://images.unsplash.com/photo-1610483178766-8092dcc6f31f?q=80&w=2000&auto=format&fit=crop",
  "Seoul": "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=2000&auto=format&fit=crop",
  "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2000&auto=format&fit=crop",
  "Paris (FR)": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop",
  "London (UK)": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop",
  "New York (US)": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000&auto=format&fit=crop",
  "Sydney (AU)": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2000&auto=format&fit=crop",
  
  "default": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
};

const LOCALES_DICT = {
  'zh-TW': {
    title: '行程規劃大師',
    subtitle: 'Premium Travel Planner',
    step1: '步驟一：設定旅行喜好', 
    dest: '目的地',
    dep: '出發地',
    dateFrom: '出發日期',
    dateTo: '回國日期',
    who: '旅遊成員',
    pace: '旅遊節奏',
    why: '目的風格 (最多選 3 項)',
    budget: '預算等級',
    transit: '交通方式',
    special: '特殊需求 (選填)',
    specialPlh: '例：有吃素需求、需要無障礙設施...',
    btnSearch: '下一步：搜尋機加酒',
    step2Title: '步驟二：選擇航班 (來回)',
    step3Title: '步驟三：選擇住宿據點',
    btnBack: '← 修改條件',
    btnGen: '據此生成每日深度導覽行程',
    loadLogistics: '大師正在檢索最優機加酒方案...',
    loadItinerary: '大師正在為您雕琢手把手深度行程...',
    budgetTitle: '每人預算分析',
    budgetTotal: '預估總額 / 人',
    dailyPlan: '大師深度導覽行程',
    reselect: '← 重新選擇機加酒',
    print: '下載為 PDF',
    outbound: '去程',
    inbound: '回程',
    flightGoogle: '前往 Google Flights 查價',
    buyPass: '查看與購買票券',
    actionGuide: '行動與轉乘指南',
    expertReason: '達人深度解析',
    officialLink: '預約 / 官網資訊',
    mapNav: '單點地圖',
    routeNav: 'A ➔ B 路線導航', 
    photo: '實景照片',
    deleteNode: '刪除',
    confirmDelete: '確認刪除？',
    swapNode: '換一個',
    swapping: 'AI 替換中...',
    max3: '已達上限',
    fromHotel: '從飯店出發',
    fromAirport: '從機場出發',
    freeTimeLoc: '🕒 自由活動時間',
    freeTimeDesc: '此行程已被移除，保留為彈性自由時間。您可以隨意探索周邊，或點擊「換一個」讓 AI 重新安排。',
    formSec1: '核心行程安排',
    formSec2: '旅客輪廓與預算',
    formSec3: '風格偏好與需求',
    options: {
      who: ['情侶', '家族 (有長者與小孩)', '朋友閨蜜', '獨旅'],
      pace: ['慢活 (睡到自然醒，一天1-2點)', '標準 (一天3-4點，含三餐)', '特種兵 (早出晚歸，打卡滿檔)'],
      why: ['放空耍廢', '🎡 主題遊樂園', '逛街血拚', '歷史文化', '🏔️ 上山下海 (大自然)', '美食狂熱', '👾 宅宅動漫文化'],
      budget: ['一般標準', '背包客窮遊', '輕奢享受', '土豪無上限'],
      transit: ['大眾運輸為主', '租車自駕', '全程計程車/包車']
    },
    locations: {
      "台灣": ["台北", "桃園", "台中", "台南", "高雄", "花東", "澎湖"],
      "日本": ["東京", "大阪", "京都", "北海道", "沖繩", "福岡", "名古屋", "仙台"],
      "韓國": ["首爾", "釜山", "濟州島", "大邱"],
      "東南亞": ["曼谷 (泰國)", "清邁 (泰國)", "普吉島 (泰國)", "新加坡", "峇里島 (印尼)", "胡志明市 (越南)", "峴港 (越南)", "吉隆坡 (馬來西亞)", "宿霧 (菲律賓)"],
      "美洲": ["洛杉磯 (美國)", "紐約 (美國)", "舊金山 (美國)", "夏威夷 (美國)", "溫哥華 (加拿大)", "多倫多 (加拿大)"],
      "歐洲": ["巴黎 (法國)", "倫敦 (英國)", "羅馬 (義大利)", "威尼斯 (義大利)", "巴塞隆納 (西班牙)", "阿姆斯特丹 (荷蘭)", "布拉格 (捷克)", "維也納 (奧地利)", "蘇黎世 (瑞士)"],
      "紐澳": ["雪梨 (澳洲)", "墨爾本 (澳洲)", "黃金海岸 (澳洲)", "奧克蘭 (紐西蘭)", "皇后鎮 (紐西蘭)"],
      "港澳中": ["香港", "澳門", "上海", "北京"]
    }
  },
  'en': {
    title: 'Itinerary Master',
    subtitle: 'Premium Travel Planner',
    step1: 'Step 1: Set Travel Preferences',
    dest: 'Destination',
    dep: 'Departure',
    dateFrom: 'Departure Date',
    dateTo: 'Return Date',
    who: 'Travelers',
    pace: 'Travel Pace',
    why: 'Travel Style (Max 3)',
    budget: 'Budget Level',
    transit: 'Transportation',
    special: 'Special Requests (Optional)',
    specialPlh: 'e.g., Vegan, wheelchair access...',
    btnSearch: 'Next: Search Flights & Hotels',
    step2Title: 'Step 2: Select Flight (Round-Trip)',
    step3Title: 'Step 3: Select Accommodation',
    btnBack: '← Back to Edit',
    btnGen: 'Generate Detailed Itinerary',
    loadLogistics: 'Master is finding the best logistics...',
    loadItinerary: 'Master is crafting your deep itinerary...',
    budgetTitle: 'Budget per Person',
    budgetTotal: 'Est. Total / Pax',
    dailyPlan: 'Master Deep Itinerary',
    reselect: '← Reselect Logistics',
    print: 'Download PDF',
    outbound: 'Outbound',
    inbound: 'Return',
    flightGoogle: 'Check on Google Flights',
    buyPass: 'Buy Pass',
    actionGuide: 'Action & Transit Guide',
    expertReason: 'Expert Insights',
    officialLink: 'Official / Booking',
    mapNav: 'Map',
    routeNav: 'A ➔ B Directions',
    photo: 'Photos',
    deleteNode: 'Remove',
    confirmDelete: 'Confirm?',
    swapNode: 'AI Swap',
    swapping: 'Swapping...',
    max3: 'Max Reached',
    fromHotel: 'From Hotel',
    fromAirport: 'From Airport',
    freeTimeLoc: '🕒 Free Time',
    freeTimeDesc: 'This activity was removed. Enjoy your flexible free time, or click "AI Swap" to generate a new plan.',
    formSec1: 'Core Itinerary',
    formSec2: 'Traveler & Budget',
    formSec3: 'Style & Requests',
    options: {
      who: ['Couples', 'Family (with kids/elders)', 'Friends', 'Solo'],
      pace: ['Relaxed (1-2 spots/day)', 'Standard (3-4 spots/day)', 'Hardcore (Packed schedule)'],
      why: ['Relax & Chill', '🎡 Theme Parks', 'Shopping Spree', 'History & Culture', '🏔️ Nature & Outdoors', 'Foodie Craze', '👾 Anime & Geek Culture'],
      budget: ['Standard', 'Backpacker', 'Affordable Luxury', 'Unlimited'],
      transit: ['Public Transit', 'Rental Car', 'Taxi/Charter only']
    },
    locations: {
      "Taiwan": ["Taipei", "Taoyuan", "Taichung", "Tainan", "Kaohsiung", "Hualien/Taitung", "Penghu"],
      "Japan": ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Okinawa", "Fukuoka", "Nagoya", "Sendai"],
      "South Korea": ["Seoul", "Busan", "Jeju Island", "Daegu"],
      "Southeast Asia": ["Bangkok (TH)", "Chiang Mai (TH)", "Phuket (TH)", "Singapore", "Bali (ID)", "Ho Chi Minh (VN)", "Da Nang (VN)", "Kuala Lumpur (MY)", "Cebu (PH)"],
      "Americas": ["Los Angeles (US)", "New York (US)", "San Francisco (US)", "Hawaii (US)", "Vancouver (CA)", "Toronto (CA)"],
      "Europe": ["Paris (FR)", "London (UK)", "Rome (IT)", "Venice (IT)", "Barcelona (ES)", "Amsterdam (NL)", "Prague (CZ)", "Vienna (AT)", "Zurich (CH)"],
      "Oceania": ["Sydney (AU)", "Melbourne (AU)", "Gold Coast (AU)", "Auckland (NZ)", "Queenstown (NZ)"],
      "HK/MO/CN": ["Hong Kong", "Macau", "Shanghai", "Beijing"]
    }
  },
  'ja': {
    title: '旅の達人プランナー',
    subtitle: 'Premium Travel Planner',
    step1: 'ステップ 1：旅行の好みを設定',
    dest: '目的地',
    dep: '出発地',
    dateFrom: '出発日',
    dateTo: '帰國日',
    who: '旅行者',
    pace: '旅行のペース',
    why: '旅行の目的 (最大3つ)',
    budget: '予算',
    transit: '交通手段',
    special: '特別な要望 (任意)',
    specialPlh: '例：ベジタリアン、車椅子対応など...',
    btnSearch: '次へ：航空券とホテルを検索',
    step2Title: 'ステップ 2：フライト選択 (往復)',
    step3Title: 'ステップ 3：宿泊先選択',
    btnBack: '← 条件を変更',
    btnGen: '詳細な旅程を作成する',
    loadLogistics: '最適なプランを検索中...',
    loadItinerary: '達人が旅程を作り込んでいます...',
    budgetTitle: '1人あたりの予算',
    budgetTotal: '推定合計 / 人',
    dailyPlan: '達人のディープ旅程表',
    reselect: '← フライト・ホテルを再選擇',
    print: 'PDFをダウンロード',
    outbound: '往路',
    inbound: '復路',
    flightGoogle: 'Google Flightsで確認',
    buyPass: 'パスを購入・確認',
    actionGuide: '行動・乗換ガイド',
    expertReason: '達人の解説',
    officialLink: '予約 / 公式サイト',
    mapNav: 'マップ',
    routeNav: 'A ➔ B ルート案内',
    photo: '写真',
    deleteNode: '削除',
    confirmDelete: '削除しますか？',
    swapNode: 'AIで変更',
    swapping: '変更中...',
    max3: '上限到達',
    fromHotel: 'ホテルから出発',
    fromAirport: '空港から出発',
    freeTimeLoc: '🕒 自由行動',
    freeTimeDesc: 'この予定は削除されました。自由な時間をお楽しみください。「AIで変更」をクリックして新しい予定を作成することもできます。',
    formSec1: '旅行の基本情報',
    formSec2: '旅行者と予算',
    formSec3: '旅行のスタイルと要望',
    options: {
      who: ['カップル', '家族 (子供・シニア同伴)', '友人同士', '一人旅'],
      pace: ['のんびり (1日1-2箇所)', 'スタンダード (1日3-4箇所)', 'ハード (予定詰め込み)'],
      why: ['リラックス', '🎡 テーマパーク', 'ショッピング', '歷史・文化', '🏔️ 大自然・海山', 'グルメ滿喫', '👾 アニメ・オタク文化'],
      budget: ['スタンダード', 'バックパッカー', 'プチ贅沢', '無制限'],
      transit: ['公共交通機関メイン', 'レンタカー', 'タクシー・貸切のみ']
    },
    locations: {
      "台灣": ["台北", "桃園", "台中", "台南", "高雄", "花東", "澎湖"],
      "日本": ["東京", "大阪", "京都", "北海道", "沖縄", "福岡", "名古屋", "仙台"],
      "韓國": ["ソウル", "釜山", "済州島", "大邱"],
      "東南亞": ["バンコク (タイ)", "チェンマイ (タイ)", "プーケット (タイ)", "シンガポール", "バリ島 (インドネシア)", "ホーチミン (ベトナム)", "ダナン (ベトナム)", "クアラルンプール (マレーシア)", "セブ (フィリピン)"],
      "北米": ["ロサンゼルス (米国)", "ニューヨーク (米国)", "サンフランシスコ (米国)", "ハワイ (米国)", "バンクーバー (カナダ)", "トロント (カナダ)"],
      "ヨーロッパ": ["パリ (仏)", "ロンドン (英)", "ローマ (伊)", "ヴェネツィア (伊)", "バルセロナ (スペイン)", "アムステルダム (蘭)", "プラハ (チェコ)", "ウィーン (墺)", "チューリッヒ (スイス)"],
      "オセアニア": ["シドニー (豪)", "メルボルン (豪)", "ゴールドコースト (豪)", "オークランド (NZ)", "クイーンズタウン (NZ)"],
      "香港/マカオ/中國": ["香港", "マカオ", "上海", "北京"]
    }
  }
};

const safeNum = (val) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseInt(val.replace(/\D/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const renderText = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return val.name ? String(val.name) : JSON.stringify(val);
  return String(val);
};

export default function App() {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [lang, setLang] = useState('zh-TW');
  const t = LOCALES_DICT[lang];
  const locs = t.locations;
  const pdfRef = useRef(null);

  const [formData, setFormData] = useState({
    who: t.options.who[0], 
    why: [t.options.why[5]],
    destCountry: '日本', destCity: '東京',
    depCountry: '台灣', depCity: '台北',
    dateFrom: today, dateTo: nextWeek,
    budget: t.options.budget[0], pace: t.options.pace[1], transit: t.options.transit[0],
    special: ''
  });

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  
  const [logisticsData, setLogisticsData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState(0);
  const [itinerary, setItinerary] = useState(null);
  
  // 狀態管理：記錄正在進行刪除確認的節點，以及正在 AI 替換的節點
  const [swappingNode, setSwappingNode] = useState(null);
  const [deletingNode, setDeletingNode] = useState(null);

  // --- 【底層引擎】單一真理英文索引 ---
  const getEnglishKeys = () => {
    try {
      const currentLocs = LOCALES_DICT[lang].locations;
      const enLocs = LOCALES_DICT['en'].locations;
      const cIdx = Object.keys(currentLocs).indexOf(formData.destCountry);
      if (cIdx === -1) return { country: 'default', city: 'default' };
      const enCountry = Object.keys(enLocs)[cIdx];
      const cityIdx = currentLocs[formData.destCountry].indexOf(formData.destCity);
      const enCity = cityIdx === -1 ? 'default' : enLocs[enCountry][cityIdx];
      return { country: enCountry, city: enCity };
    } catch (e) { return { country: 'default', city: 'default' }; }
  };

  const enKeys = getEnglishKeys();
  const currentBgImage = bgImages[enKeys.city] || bgImages[enKeys.country] || bgImages['default'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhyToggle = (option) => {
    setFormData(prev => {
      let newWhy = [...prev.why];
      if (newWhy.includes(option)) {
        newWhy = newWhy.filter(w => w !== option);
        if (newWhy.length === 0) newWhy = [t.options.why[0]];
      } else {
        if (newWhy.length < 3) newWhy.push(option);
      }
      return { ...prev, why: newWhy };
    });
  };

  const handleLocationChange = (field, value) => {
    if (field === 'depCountry') setFormData(prev => ({ ...prev, depCountry: value, depCity: locs[value][0] }));
    else if (field === 'destCountry') setFormData(prev => ({ ...prev, destCountry: value, destCity: locs[value][0] }));
    else setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLangChange = (newLang) => {
    const oldLocs = LOCALES_DICT[lang].locations;
    const newLocs = LOCALES_DICT[newLang].locations;
    const newOptions = LOCALES_DICT[newLang].options;
    const oldDepCountryKeys = Object.keys(oldLocs);
    const depCIdx = oldDepCountryKeys.indexOf(formData.depCountry);
    const depCityIdx = depCIdx >= 0 ? oldLocs[formData.depCountry].indexOf(formData.depCity) : 0;
    const oldDestCountryKeys = Object.keys(oldLocs);
    const destCIdx = oldDestCountryKeys.indexOf(formData.destCountry);
    const destCityIdx = destCIdx >= 0 ? oldLocs[formData.destCountry].indexOf(formData.destCity) : 0;
    const mappedDepCountry = Object.keys(newLocs)[Math.max(0, depCIdx)];
    const mappedDepCity = newLocs[mappedDepCountry][Math.max(0, depCityIdx)];
    const mappedDestCountry = Object.keys(newLocs)[Math.max(0, destCIdx)];
    const mappedDestCity = newLocs[mappedDestCountry][Math.max(0, destCityIdx)];

    setFormData(prev => ({
      ...prev,
      depCountry: mappedDepCountry, depCity: mappedDepCity,
      destCountry: mappedDestCountry, destCity: mappedDestCity,
      who: newOptions.who[0], why: [newOptions.why[5]], budget: newOptions.budget[0],
      pace: newOptions.pace[1], transit: newOptions.transit[0],
    }));
    setLang(newLang);
  };

  const calculateDays = () => Math.ceil((new Date(formData.dateTo) - new Date(formData.dateFrom)) / 86400000) + 1;
  const getDepartureStr = () => `${formData.depCountry} ${formData.depCity}`;
  const getDestinationStr = () => `${formData.destCountry} ${formData.destCity}`;
  const targetLangStr = lang === 'en' ? 'English' : (lang === 'ja' ? 'Japanese' : 'Traditional Chinese (zh-TW)');
  
  const getGoogleFlightsUrl = () => {
    const cleanDep = formData.depCity.split(' (')[0];
    const cleanDest = formData.destCity.split(' (')[0];
    return `https://www.google.com/travel/flights?q=Flights%20from%20${encodeURIComponent(cleanDep)}%20to%20${encodeURIComponent(cleanDest)}%20on%20${formData.dateFrom}%20through%20${formData.dateTo}`;
  };

  const callGemini = async (prompt, systemInstruction, retryCount = 0) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      if (!response.ok) throw new Error(`API: ${response.status}`);
      const data = await response.json();
      let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) throw new Error("Empty Response");
      return JSON.parse(textOutput.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch (err) {
      if (retryCount < 3) {
        await new Promise(res => setTimeout(res, [2000, 4000, 8000][retryCount]));
        return callGemini(prompt, systemInstruction, retryCount + 1);
      }
      throw err;
    }
  };

  const handleFetchLogistics = async (e) => {
    e.preventDefault();
    if (calculateDays() <= 0) return setErrorMsg('Date Error');
    setStep(2); setErrorMsg('');
    const prompt = `From: ${getDepartureStr()}, To: ${getDestinationStr()}. Dates: ${formData.dateFrom} ~ ${formData.dateTo}. Budget: ${formData.budget}`;
    
    const sysInst = `Output STRICTLY a JSON object with two arrays. YOU MUST RETURN EXACTLY 3 ITEMS IN EACH ARRAY. DO NOT RETURN ONLY 1.
      CRITICAL MANDATE: All textual content MUST be written in ${targetLangStr}.
      CRITICAL MANDATE: All price strings MUST include appropriate currency symbols.
      {
        "flightOptions": [
          {"airline":"Airline 1", "outbound":"08:00 TPE -> 11:30 KIX", "inbound":"13:00 KIX -> 15:00 TPE", "priceEstimate":"Estimated ROUND-TRIP Price with currency"},
          {"airline":"...", "outbound":"...", "inbound":"...", "priceEstimate":"..."},
          {"airline":"...", "outbound":"...", "inbound":"...", "priceEstimate":"..."}
        ],
        "hotelOptions": [
          {"name":"Hotel 1", "reason":"...", "pricePerNight":"Price with currency", "officialLink":"Booking link"},
          {"name":"...", "reason":"...", "pricePerNight":"...", "officialLink":"..."},
          {"name":"...", "reason":"...", "pricePerNight":"...", "officialLink":"..."}
        ]
      }`;
    
    try {
      const data = await callGemini(prompt, sysInst);
      if (!data.flightOptions || data.flightOptions.length === 0) throw new Error("AI returned no flights");
      setLogisticsData(data);
      setStep(3);
    } catch (e) { setErrorMsg('API Error: Failed to fetch logistics. Please try again.'); setStep(1); }
  };

  const handleGenerateItinerary = async () => {
    setStep(4); setErrorMsg('');
    const cf = logisticsData.flightOptions[selectedFlight], ch = logisticsData.hotelOptions[selectedHotel];
    const prompt = `${getDepartureStr()} to ${getDestinationStr()} (${calculateDays()} days). Pace: ${formData.pace}. Styles: ${formData.why.join(' AND ')}. Flight: ${cf.airline} (${cf.outbound} / ${cf.inbound}). Hotel: ${ch.name}.`;
    
    const sysInst = `Output STRICT JSON. 
      CRITICAL MANDATE: All generated text MUST be entirely in ${targetLangStr}.
      CRITICAL MANDATE: Make sure 'costEstimate' includes the appropriate currency symbol.
      CRITICAL MANDATE - BOUNDARY EVENTS:
      1. Day 1, Activity 1 MUST be the Outbound Flight.
      2. Day 1, Activity 2 MUST be type="transit" representing the journey from the destination airport to the Hotel/City.
      3. The SECOND TO LAST activity on the LAST day MUST be type="transit" representing the journey from Hotel/City to the destination airport.
      4. The LAST activity on the LAST day MUST be the Inbound Flight.
      Rule: 3 meals/day. 
      {
        "summary":"...", 
        "budgetAnalysisPerPerson":{
          "flight": 15000, "hotel": 8000, "food": 5000, "transport": 2000, "tickets": 3000, "total": 33000
        }, 
        "recommendedPasses":[{"passName":"", "reason":"", "buyLink":""}], 
        "dailyPlan":[{"day":1,"date":"","theme":"","activities":[{"time":"08:00","type":"food","location":"","operatingHours":"","detailedInstruction":"80+ words","expertReason":"50+ words","officialLink":"","costEstimate":"Cost with currency symbol"}]}]
      }
      CRITICAL: All values in budgetAnalysisPerPerson MUST BE INTEGERS. NO COMMAS, NO CURRENCY SYMBOLS.`;
    try {
      setItinerary(await callGemini(prompt, sysInst));
      setStep(5);
    } catch (e) { setErrorMsg('API Error: Timeout or format error.'); setStep(3); }
  };

  // --- 【核心修復】雙擊防護型刪除與自由時間降級 ---
  const handleDeleteNode = (dayIdx, actIdx) => {
    const nodeKey = `${dayIdx}-${actIdx}`;
    
    // 若處於確認刪除狀態，則執行轉換為自由時間
    if (deletingNode === nodeKey) {
      const newItin = { ...itinerary };
      const currentAct = newItin.dailyPlan[dayIdx].activities[actIdx];
      
      // 保留原本的時間點，將節點優雅降級為自由時間，防止時間軸斷層
      newItin.dailyPlan[dayIdx].activities[actIdx] = {
        time: currentAct.time,
        type: 'freetime',
        location: t.freeTimeLoc,
        detailedInstruction: t.freeTimeDesc,
        costEstimate: '',
        operatingHours: '',
        expertReason: '',
        officialLink: ''
      };
      
      setItinerary(newItin);
      setDeletingNode(null);
    } else {
      // 觸發第一次點擊：進入確認狀態
      setDeletingNode(nodeKey);
      // 3秒後自動取消確認狀態
      setTimeout(() => {
        setDeletingNode(current => current === nodeKey ? null : current);
      }, 3000);
    }
  };

  const handleSwapNode = async (dayIdx, actIdx) => {
    setSwappingNode(`${dayIdx}-${actIdx}`);
    const day = itinerary.dailyPlan[dayIdx];
    const targetAct = day.activities[actIdx];
    const prevAct = actIdx > 0 ? renderText(day.activities[actIdx - 1].location) : "Start of day";
    const nextAct = actIdx < day.activities.length - 1 ? renderText(day.activities[actIdx + 1].location) : "End of day";

    const prompt = `City: ${getDestinationStr()}. Context: Day ${day.day}. Previous: ${prevAct}. Next: ${nextAct}. Styles: ${formData.why.join(', ')}.
      Do NOT go to "${renderText(targetAct.location)}" at ${targetAct.time}. Suggest ONE alternative activity (type: ${targetAct.type === 'transit' ? 'attraction' : targetAct.type}).`;

    const sysInst = `Output ONLY a single JSON object. 
      CRITICAL MANDATE: Output MUST be entirely in ${targetLangStr}.
      {"time":"${targetAct.time}", "type":"${targetAct.type}", "location":"Alternative Name", "operatingHours":"...", "detailedInstruction":"80+ words", "expertReason":"50+ words", "officialLink":"", "costEstimate":""}`;

    try {
      const newActivity = await callGemini(prompt, sysInst);
      const newItin = { ...itinerary };
      newItin.dailyPlan[dayIdx].activities[actIdx] = newActivity;
      setItinerary(newItin);
    } catch (error) {
      alert(lang === 'zh-TW' ? "AI 替換失敗，請再試一次。" : "Swap failed. Try again.");
    } finally {
      setSwappingNode(null);
      setDeletingNode(null); // 如果剛好在刪除狀態，清除它
    }
  };

  const handleDownloadPDF = () => {
    setIsPdfLoading(true);
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.body.appendChild(script);
    
    script.onload = () => {
      const element = pdfRef.current;
      const opt = {
        margin:       [0.5, 0, 0.5, 0],
        filename:     `${formData.destCity}_Itinerary.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save().then(() => setIsPdfLoading(false)).catch(err => {
        setIsPdfLoading(false); alert("PDF 產出失敗，請嘗試使用瀏覽器的列印功能 (Ctrl+P)。");
      });
    };
  };

  const getGoogleMapsUrl = (query, city) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' ' + city)}`;
  const getGoogleImagesUrl = (query, city) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query + ' ' + city)}`;
  const formatCurrency = (num) => new Intl.NumberFormat(lang === 'ja' ? 'ja-JP' : (lang === 'en' ? 'en-US' : 'zh-TW'), { style: 'currency', currency: lang === 'ja' ? 'JPY' : (lang === 'en' ? 'USD' : 'TWD'), maximumFractionDigits: 0 }).format(num);

  const getRouteUrl = (dayIdx, actIdx, activities, hotelName) => {
    if (dayIdx === 0 && actIdx === 0) return null; 
    if (dayIdx === itinerary.dailyPlan.length - 1 && actIdx === activities.length - 1) return null;
    
    // 如果當前節點是自由活動，不提供具體的導航路線
    if (activities[actIdx].type === 'freetime') return null;

    let origin = '';
    const currentLocObj = activities[actIdx].location;
    const currentLoc = typeof currentLocObj === 'object' ? (currentLocObj.name || '') : currentLocObj;

    if (dayIdx === 0 && actIdx === 1) origin = `${formData.destCity.split(' (')[0]} Airport`; 
    else if (actIdx === 0) origin = hotelName;
    else {
       const prevLocObj = activities[actIdx - 1].location;
       origin = typeof prevLocObj === 'object' ? (prevLocObj.name || '') : prevLocObj;
    }

    let mode = 'transit';
    if (formData.transit.includes('自駕') || formData.transit.includes('計程車')) mode = 'driving';

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(currentLoc)}&travelmode=${mode}`;
  };

  const getOriginText = (dayIdx, actIdx) => {
    if (dayIdx === 0 && actIdx === 1) return t.fromAirport;
    if (actIdx === 0) return t.fromHotel;
    const loc = itinerary.dailyPlan[dayIdx].activities[actIdx - 1].location;
    return typeof loc === 'object' ? (loc.name || JSON.stringify(loc)) : loc;
  };

  return (
    <div className="min-h-screen font-sans relative selection:bg-pink-200">
      
      <div className="fixed inset-0 z-[-2] bg-gradient-to-br from-[#e0f2fe] via-[#f8fafc] to-[#fce7f3] print:hidden"></div>
      
      <div className="fixed inset-0 z-[-1] print:hidden pointer-events-none">
        <img 
          src={currentBgImage} 
          alt="City Background" 
          key={enKeys.city + enKeys.country} 
          onError={(e) => {
            const currentSrc = e.target.src;
            const countryUrl = bgImages[enKeys.country];
            const defaultUrl = bgImages['default'];

            if (countryUrl && currentSrc !== countryUrl && currentSrc !== defaultUrl) {
              e.target.src = countryUrl;
            } else if (currentSrc !== defaultUrl) {
              e.target.src = defaultUrl;
            } else {
              e.target.style.display = 'none';
            }
          }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out animate-in fade-in" 
        />
        <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"></div>
      </div>

      <header className="relative z-10 p-6 md:p-8 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-lg">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-white tracking-tight cursor-pointer drop-shadow-md" onClick={() => setStep(1)}>{t.title}</h1>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30 shadow-sm whitespace-nowrap">{APP_VERSION.split(' - ')[0]}</span>
              </div>
              <p className="text-sm font-medium text-blue-100 mt-0.5 tracking-wide drop-shadow-md">{t.subtitle}</p>
            </div>
          </div>
          
          {step === 1 && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-sm transition-all duration-300">
              <Globe className="w-4 h-4 text-white ml-2" />
              <select value={lang} onChange={(e) => handleLangChange(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold text-white cursor-pointer pr-2 [&>option]:text-slate-800">
                <option value="zh-TW">繁體中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:px-8 pb-24 relative z-10">
        
        {/* --- 【全新視覺重構】模組化卡片群組表單 --- */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-white/50 print:hidden text-center">
              <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-3 mb-8">
                <Sparkles className="w-7 h-7 text-indigo-500" />
                {lang === 'zh-TW' ? '輕鬆規劃三步驟' : (lang === 'ja' ? '簡単3ステップ計画' : 'Easy 3-Step Planning')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="flex flex-col items-center gap-3 p-6 bg-white/80 rounded-2xl border border-slate-100 shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
                  <div className="text-5xl mb-2">👀</div>
                  <div className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs shadow-sm">STEP 1</div>
                  <p className="font-bold text-slate-800">{t.step1.split('：')[1] || t.step1}</p>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 bg-white/80 rounded-2xl border border-slate-100 shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
                  <div className="text-5xl mb-2">✈️</div>
                  <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs shadow-sm">STEP 2</div>
                  <p className="font-bold text-slate-800">{lang === 'zh-TW' ? '檢索機加酒' : (lang === 'ja' ? '飛行機・ホテル検索' : 'Search Flights/Hotels')}</p>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 bg-white/80 rounded-2xl border border-slate-100 shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
                  <div className="text-5xl mb-2">🗺️</div>
                  <div className="bg-pink-100 text-pink-700 font-bold px-3 py-1 rounded-full text-xs shadow-sm">STEP 3</div>
                  <p className="font-bold text-slate-800">{lang === 'zh-TW' ? '生成深度行程' : (lang === 'ja' ? '詳細旅程作成' : 'Generate Itinerary')}</p>
                </div>
                <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-indigo-100 -translate-y-1/2 hidden md:block z-0"></div>
              </div>
            </div>

            <div className="bg-white/85 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white overflow-hidden print:hidden">
              <div className="p-8 md:p-10 border-b border-slate-100/50 bg-gradient-to-r from-white/50 to-transparent">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800"><span className="bg-blue-100 p-2 rounded-xl shadow-sm"><MapPin className="text-blue-600 w-6 h-6" /></span>{t.step1}</h2>
              </div>
              
              <form onSubmit={handleFetchLogistics} className="p-8 md:p-10 space-y-10">
                
                {/* --- 區塊 1：核心行程安排 --- */}
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2 mb-2"><MapPin className="w-5 h-5 text-indigo-500"/> {t.formSec1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-700">{t.dest}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select value={formData.destCountry} onChange={(e) => handleLocationChange('destCountry', e.target.value)} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-medium text-slate-800 shadow-sm transition-all hover:border-indigo-300">
                          {Object.keys(locs).map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                        <select value={formData.destCity} onChange={(e) => handleLocationChange('destCity', e.target.value)} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-medium text-slate-800 shadow-sm transition-all hover:border-indigo-300">
                          {locs[formData.destCountry]?.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-700">{t.dep}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select value={formData.depCountry} onChange={(e) => handleLocationChange('depCountry', e.target.value)} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-medium text-slate-800 shadow-sm transition-all hover:border-indigo-300">
                          {Object.keys(locs).map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                        <select value={formData.depCity} onChange={(e) => handleLocationChange('depCity', e.target.value)} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-medium text-slate-800 shadow-sm transition-all hover:border-indigo-300">
                          {locs[formData.depCountry]?.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-700"><Calendar className="w-4 h-4 text-indigo-500"/> {t.dateFrom}</label>
                      <input type="date" name="dateFrom" value={formData.dateFrom} onChange={handleChange} required className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-700"><Calendar className="w-4 h-4 text-pink-500"/> {t.dateTo}</label>
                      <input type="date" name="dateTo" value={formData.dateTo} onChange={handleChange} required className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-pink-300" />
                    </div>
                  </div>
                </div>

                {/* --- 區塊 2：旅客輪廓與預算 --- */}
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-indigo-500"/> {t.formSec2}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-700">{t.who}</label>
                      <select name="who" value={formData.who} onChange={handleChange} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300">{t.options.who.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-700">{t.pace}</label>
                      <select name="pace" value={formData.pace} onChange={handleChange} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300">{t.options.pace.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-700">{t.budget}</label>
                      <select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300">{t.options.budget.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                  </div>
                </div>

                {/* --- 區塊 3：風格偏好與需求 --- */}
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2 mb-2"><Compass className="w-5 h-5 text-indigo-500"/> {t.formSec3}</h3>
                  <div className="space-y-3">
                    <label className="text-sm font-bold flex items-center gap-2 text-slate-700">{t.why}</label>
                    <div className="flex flex-wrap gap-2.5">
                      {t.options.why.map(opt => {
                        const isSelected = formData.why.includes(opt);
                        const isMax = formData.why.length >= 3 && !isSelected;
                        return (
                          <button type="button" key={opt} onClick={() => handleWhyToggle(opt)} disabled={isMax}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'}`}
                          >
                            {isSelected && <Check className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />} {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-2 lg:col-span-1">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-400"/> {t.transit}
                      <select name="transit" value={formData.transit} onChange={handleChange} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300">{t.options.transit.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-sm font-bold flex text-slate-700">{t.special}</label>
                      <input type="text" name="special" value={formData.special} onChange={handleChange} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300" placeholder={t.specialPlh} />
                    </div>
                  </div>
                </div>

                {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 shadow-sm"><AlertCircle className="w-5 h-5 shrink-0" /> {errorMsg}</div>}

                <div className="pt-8 flex justify-end border-t border-slate-200/60">
                  <button type="submit" className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all flex items-center gap-3 border border-slate-700">
                    {t.btnSearch} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {(step === 2 || step === 4) && (
          <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-white">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
              <h2 className="text-2xl font-black text-slate-800 mb-3">{step === 2 ? t.loadLogistics : t.loadItinerary}</h2>
            </div>
          </div>
        )}

        {step === 3 && logisticsData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setStep(1)} className="text-white font-bold hover:text-blue-100 flex items-center gap-2 bg-slate-900/50 px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-sm transition-colors">{t.btnBack}</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6"><PlaneTakeoff className="w-6 h-6 text-blue-600" /> {t.step2Title}</h3>
                <div className="space-y-4">
                  {logisticsData.flightOptions?.map((flight, idx) => (
                    <div key={idx} onClick={() => setSelectedFlight(idx)} className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all ${selectedFlight === idx ? 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300 bg-white hover:shadow-md'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-black text-slate-800 text-lg">{renderText(flight.airline)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="text-xs font-bold text-slate-400 block mb-1">{t.outbound}</span><span className="font-medium text-slate-700">{renderText(flight.outbound)}</span></div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="text-xs font-bold text-slate-400 block mb-1">{t.inbound}</span><span className="font-medium text-slate-700">{renderText(flight.inbound)}</span></div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <p className="font-black text-blue-700 text-xl">{renderText(flight.priceEstimate)}</p>
                        <a href={getGoogleFlightsUrl()} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()} className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm">
                          {t.flightGoogle} <ExternalLink className="w-3.5 h-3.5"/>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6"><Bed className="w-6 h-6 text-pink-600" /> {t.step3Title}</h3>
                <div className="space-y-4">
                  {logisticsData.hotelOptions?.map((hotel, idx) => (
                    <div key={idx} onClick={() => setSelectedHotel(idx)} className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all ${selectedHotel === idx ? 'border-pink-500 bg-pink-50 shadow-lg ring-4 ring-pink-500/20' : 'border-slate-200 hover:border-pink-300 bg-white hover:shadow-md'}`}>
                      <h4 className="font-black text-slate-800 text-xl mb-2">{renderText(hotel.name)}</h4>
                      <p className="text-sm text-slate-600 mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium leading-relaxed">{renderText(hotel.reason)}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-black text-pink-700 text-xl">{renderText(hotel.pricePerNight)}</p>
                        {hotel.officialLink && (
                          <a href={hotel.officialLink} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()} className="text-sm font-bold bg-white text-pink-700 px-4 py-2 rounded-xl border-2 border-pink-200 hover:bg-pink-50 flex items-center gap-1.5 transition-colors shadow-sm">
                            {t.officialLink} <ExternalLink className="w-3.5 h-3.5"/>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold">{errorMsg}</div>}
            <div className="flex justify-center mt-10">
              <button onClick={handleGenerateItinerary} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xl py-5 px-16 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 transition-all flex items-center gap-3 border border-indigo-400/50">
                <Sparkles className="w-6 h-6" /> {t.btnGen}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: 最終深度行程呈現 */}
        {step === 5 && itinerary && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex flex-wrap justify-between items-center gap-4 print:hidden px-2">
              <button onClick={() => setStep(3)} className="text-white font-bold hover:text-blue-100 flex items-center gap-2 bg-slate-900/50 px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-sm transition-colors">{t.reselect}</button>
              <button onClick={handleDownloadPDF} disabled={isPdfLoading} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 border border-slate-700">
                {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {t.print}
              </button>
            </div>

            <div ref={pdfRef} className="space-y-8 print:bg-white print:p-0">
              
              <div className="bg-gradient-to-br from-indigo-900/95 via-slate-900/95 to-blue-900/95 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden print:bg-slate-900 print:text-white print:break-inside-avoid border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Compass className="w-64 h-64" /></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-bold px-5 py-2.5 rounded-full text-sm mb-6 border border-white/30 shadow-sm">
                    <Calendar className="w-4 h-4" /> {formData.dateFrom} - {formData.dateTo} ({calculateDays()} Days)
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-100 drop-shadow-sm">
                    {formData.destCity} {t.dailyPlan}
                  </h2>
                  <p className="text-lg md:text-xl text-blue-50 font-medium mb-10 max-w-3xl leading-relaxed border-l-4 border-blue-400 pl-5">
                    {renderText(itinerary.summary)}
                  </p>

                  {logisticsData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:grid-cols-2">
                      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-inner">
                        <div className="flex items-center gap-2 text-blue-200 mb-3"><PlaneTakeoff className="w-5 h-5"/> <span className="font-bold uppercase tracking-wider text-xs">Confirmed Flight</span></div>
                        <p className="font-black text-white text-xl">{renderText(logisticsData.flightOptions[selectedFlight]?.airline)}</p>
                        <div className="mt-3 space-y-1.5">
                          <p className="text-sm text-blue-50 font-medium bg-black/20 px-3 py-1.5 rounded-lg inline-block">🛫 {t.outbound}: {renderText(logisticsData.flightOptions[selectedFlight]?.outbound)}</p>
                          <br />
                          <p className="text-sm text-blue-50 font-medium bg-black/20 px-3 py-1.5 rounded-lg inline-block">🛬 {t.inbound}: {renderText(logisticsData.flightOptions[selectedFlight]?.inbound)}</p>
                        </div>
                        <a href={getGoogleFlightsUrl()} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-xs font-bold bg-blue-500/40 hover:bg-blue-500/60 px-4 py-2 rounded-xl transition-colors border border-blue-400/50 print:hidden">{t.flightGoogle}</a>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-inner">
                        <div className="flex items-center gap-2 text-pink-200 mb-3"><Bed className="w-5 h-5"/> <span className="font-bold uppercase tracking-wider text-xs">Confirmed Hotel</span></div>
                        <p className="font-black text-white text-xl">{renderText(logisticsData.hotelOptions[selectedHotel]?.name)}</p>
                        <p className="text-sm text-blue-50/90 mt-3 leading-relaxed">{renderText(logisticsData.hotelOptions[selectedHotel]?.reason)}</p>
                        {logisticsData.hotelOptions[selectedHotel]?.officialLink && (
                          <a href={logisticsData.hotelOptions[selectedHotel].officialLink} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-xs font-bold bg-pink-500/40 hover:bg-pink-500/60 px-4 py-2 rounded-xl transition-colors border border-pink-400/50 print:hidden">{t.officialLink}</a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {itinerary.budgetAnalysisPerPerson && (
                <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white print:border-2 print:border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Wallet className="w-7 h-7 text-green-500" /> {t.budgetTitle}</h3>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.budgetTotal}</p>
                      <p className="text-4xl font-black text-indigo-600 drop-shadow-sm">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.total))}</p>
                    </div>
                  </div>
                  <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner mb-8">
                    <div className="bg-blue-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.flight) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-pink-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.hotel) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-orange-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.food) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-indigo-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.tickets) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-slate-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.transport) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm font-medium">
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-blue-500 flex items-center gap-1.5 mb-1"><PlaneTakeoff className="w-4 h-4"/>Flight</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.flight))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-pink-500 flex items-center gap-1.5 mb-1"><Bed className="w-4 h-4"/>Hotel</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.hotel))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-orange-500 flex items-center gap-1.5 mb-1"><Coffee className="w-4 h-4"/>Food</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.food))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-indigo-500 flex items-center gap-1.5 mb-1"><Ticket className="w-4 h-4"/>Tickets</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.tickets))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-slate-500 flex items-center gap-1.5 mb-1"><Train className="w-4 h-4"/>Transit</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.transport))}</span></div>
                  </div>
                </div>
              )}

              {itinerary.recommendedPasses && itinerary.recommendedPasses.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50/95 to-blue-50/95 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-xl print:hidden">
                  <h3 className="text-xl font-black text-indigo-900 flex items-center gap-3 mb-6">
                    <Ticket className="w-6 h-6 text-indigo-600" /> Recommended Passes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {itinerary.recommendedPasses.map((pass, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-white hover:shadow-md transition-shadow">
                        <h4 className="font-black text-slate-800 text-lg mb-2">{renderText(pass.passName)}</h4>
                        <p className="text-sm text-slate-600 mb-5 font-medium leading-relaxed">{renderText(pass.reason)}</p>
                        {pass.buyLink && (
                          <a href={pass.buyLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                            {t.buyPass} <ExternalLink className="w-3.5 h-3.5"/>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-10">
                {itinerary.dailyPlan?.map((day, idx) => (
                  <div key={idx} className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80 overflow-hidden print:border-2 print:border-slate-300 print:break-inside-avoid print:shadow-none print:mt-4">
                    
                    <div className="bg-slate-900/95 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 print:bg-slate-100">
                      <div className="flex items-center gap-5">
                        <div className="bg-indigo-500 text-white font-black text-2xl w-16 h-16 flex items-center justify-center rounded-[1.5rem] shadow-lg print:bg-indigo-100 print:text-indigo-900 print:border print:border-indigo-300">D{day.day}</div>
                        <div>
                          <p className="text-indigo-200 font-bold text-sm tracking-widest print:text-slate-500 uppercase">{day.date}</p>
                          <h3 className="font-black text-white text-3xl tracking-tight mt-1 print:text-slate-900">{renderText(day.theme)}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-10 relative">
                      <div className="absolute left-[65px] top-10 bottom-10 w-1 bg-slate-200/60 z-0 hidden md:block print:block rounded-full"></div>
                      
                      <div className="space-y-12 relative z-10">
                        {day.activities?.map((act, actIdx) => {
                          // 動態判定 Icon 與主題色
                          let Icon = MapPin;
                          let iconTheme = "text-indigo-600 bg-indigo-100 border-indigo-200";
                          if (act.type === 'food') { Icon = Coffee; iconTheme = "text-orange-600 bg-orange-100 border-orange-200"; }
                          if (act.type === 'transit') { Icon = Train; iconTheme = "text-slate-700 bg-slate-200 border-slate-300"; }
                          if (act.type === 'hotel') { Icon = Bed; iconTheme = "text-pink-600 bg-pink-100 border-pink-200"; }
                          if (act.type === 'freetime') { Icon = Clock; iconTheme = "text-teal-600 bg-teal-100 border-teal-200"; }

                          const isThisNodeSwapping = swappingNode === `${idx}-${actIdx}`;
                          const isBoundaryNode = (idx === 0 && actIdx === 0) || (idx === itinerary.dailyPlan.length - 1 && actIdx === day.activities.length - 1);
                          const isFreeTime = act.type === 'freetime';
                          
                          const routeUrl = getRouteUrl(idx, actIdx, day.activities, renderText(logisticsData.hotelOptions[selectedHotel]?.name));
                          const originText = getOriginText(idx, actIdx);

                          return (
                            <div key={actIdx} className={`flex flex-col md:flex-row gap-8 items-start group relative ${isFreeTime ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}>
                              <div className="flex items-center md:flex-col md:w-28 shrink-0 gap-4 pt-2">
                                <span className="font-black text-slate-800 text-xl tracking-tight drop-shadow-sm">{renderText(act.time)}</span>
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-md border-4 ring-4 ring-white/50 ${iconTheme}`}><Icon className="w-7 h-7" /></div>
                              </div>
                              
                              <div className={`flex-1 bg-white/95 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 print:shadow-none print:border-b-2 print:border-slate-200 print:rounded-none relative overflow-hidden print:p-4 w-full ${isFreeTime ? 'border-2 border-dashed border-teal-200 bg-teal-50/30' : 'border border-white'}`}>
                                
                                {routeUrl && (
                                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-b border-indigo-100/50 px-8 py-3 flex items-center justify-between print:hidden backdrop-blur-sm">
                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 truncate">
                                      <MapPinned className="w-4 h-4 text-indigo-500 shrink-0"/>
                                      <span className="truncate">{renderText(originText)}</span>
                                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0"/>
                                      <span className="truncate">{renderText(act.location)}</span>
                                    </div>
                                    <a href={routeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shrink-0">
                                      <Navigation className="w-3.5 h-3.5"/> {t.routeNav}
                                    </a>
                                  </div>
                                )}

                                <div className={`${routeUrl ? 'pt-10' : ''}`}>
                                  {isThisNodeSwapping && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[2rem]">
                                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
                                      <span className="text-indigo-800 font-bold text-lg">{t.swapping}</span>
                                    </div>
                                  )}

                                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                                    <h4 className={`font-black text-3xl leading-tight mt-1 drop-shadow-sm ${isFreeTime ? 'text-teal-800' : 'text-slate-800'}`}>
                                      {renderText(act.location)}
                                    </h4>
                                    
                                    {!isBoundaryNode && (
                                      <div className="flex items-center gap-3 print:hidden">
                                        <button onClick={() => handleSwapNode(idx, actIdx)} className="flex items-center gap-1.5 text-sm font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-xl transition-colors shadow-sm">
                                          <RefreshCw className="w-4 h-4" /> {t.swapNode}
                                        </button>
                                        
                                        {/* 【核心修復】雙擊防護型刪除：避免時空斷層 */}
                                        {!isFreeTime && (
                                          <button 
                                            onClick={() => handleDeleteNode(idx, actIdx)} 
                                            className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${deletingNode === `${idx}-${actIdx}` ? 'bg-red-600 text-white animate-pulse' : 'text-red-700 bg-red-100 hover:bg-red-200'}`}
                                          >
                                            <Trash2 className="w-4 h-4" /> 
                                            {deletingNode === `${idx}-${actIdx}` ? t.confirmDelete : t.deleteNode}
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {act.costEstimate && !isFreeTime && (
                                    <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 font-bold px-4 py-2 rounded-xl text-sm whitespace-nowrap mb-5 print:bg-transparent print:border print:border-slate-200 shadow-sm border border-slate-200/50">
                                      <Wallet className="w-4 h-4 text-slate-500"/> 
                                      {renderText(act.costEstimate)}
                                    </span>
                                  )}

                                  {act.operatingHours && !isFreeTime && (
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-5 bg-white inline-flex px-4 py-2 rounded-xl border border-slate-200 ml-3 print:bg-transparent print:border print:border-slate-200 shadow-sm">
                                      <Clock className="w-4 h-4 text-slate-400" /> {renderText(act.operatingHours)}
                                    </div>
                                  )}

                                  <div className={`${isFreeTime ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-200/60'} p-6 md:p-8 rounded-3xl border mb-6 print:bg-transparent print:border-none print:p-0 print:mb-4 shadow-sm`}>
                                    {!isFreeTime && (
                                      <div className="flex items-center gap-2.5 mb-3">
                                        {act.type === 'transit' ? <Car className="w-5 h-5 text-slate-500"/> : <CheckCircle2 className="w-5 h-5 text-orange-500"/>}
                                        <strong className="text-slate-800 text-lg">{t.actionGuide}</strong>
                                      </div>
                                    )}
                                    <p className={`${isFreeTime ? 'text-teal-700' : 'text-slate-700'} leading-relaxed text-base md:text-lg font-medium whitespace-pre-wrap`}>
                                      {renderText(act.detailedInstruction)}
                                    </p>
                                  </div>

                                  {act.expertReason && !isFreeTime && (
                                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-6 md:p-8 rounded-3xl mb-6 print:bg-indigo-50/30 print:border-none print:p-4 shadow-sm">
                                      <div className="flex gap-4 text-indigo-900">
                                        <Sparkles className="w-6 h-6 shrink-0 text-indigo-600 mt-1" />
                                        <div>
                                          <strong className="block text-lg font-black text-indigo-900 mb-2 tracking-wide">{t.expertReason}</strong>
                                          <p className="text-base md:text-lg font-medium leading-relaxed text-indigo-800/90 whitespace-pre-wrap">
                                            {renderText(act.expertReason)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* 自由時間不顯示外部連結按鈕 */}
                                  {!isFreeTime && (
                                    <div className="flex flex-wrap gap-4 print:hidden pt-2">
                                      {act.officialLink && (
                                        <a href={act.officialLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-colors border border-slate-700">
                                          <ExternalLink className="w-4 h-4"/> {t.officialLink}
                                        </a>
                                      )}
                                      
                                      {act.type !== 'transit' && (
                                        <>
                                          <a href={getGoogleMapsUrl(renderText(act.location), formData.destCity)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
                                            <Map className="w-4 h-4 text-blue-600"/> {t.mapNav}
                                          </a>
                                          <a href={getGoogleImagesUrl(renderText(act.location), formData.destCity)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
                                            <ImageIcon className="w-4 h-4 text-purple-600"/> {t.photo}
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- 頁尾版號宣告 --- */}
      <footer className="relative z-10 py-8 text-center text-white/70 text-xs font-bold tracking-widest print:hidden">
        © 2026 | ITINERARY MASTER | VERSION {APP_VERSION.split(' - ')[0]}
      </footer>
    </div>
  );
}