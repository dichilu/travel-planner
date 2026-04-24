import React, { useState, useRef, useEffect } from 'react';
import { 
  PlaneTakeoff, MapPin, Calendar, Users, Wallet, Activity, 
  Bed, Train, Coffee, Printer, ExternalLink, AlertCircle, 
  Compass, Ticket, Loader2, Navigation, Image as ImageIcon,
  Car, Info, CheckCircle2, Map, Sparkles, ArrowRight, Clock,
  Globe, Trash2, RefreshCw, Download, Check, MapPinned, X, Edit2, AlertTriangle
} from 'lucide-react';

// --- 全域應用程式版號 ---
const APP_VERSION = "v1.28.0 - 營業時間防呆與誠實 Prompt (Operating Hours Disclaimer)";

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
  "Osaka/Kyoto": "https://images.unsplash.com/photo-1590222047805-4c07baf0a30b?q=80&w=2000&auto=format&fit=crop",
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
    swapPrompt: '發生什麼事？想換哪種類型：',
    swapOpts: { indoor: '躲雨/室內', relax: '太累想休息', food: '找吃喝', any: 'AI 隨機推薦', custom: '✏️ 自己輸入' },
    customPlh: '想去哪裡？(如: 敘敘苑燒肉)',
    btnConfirm: '確定',
    btnCancel: '取消',
    swapping: 'AI 替換中...',
    max3: '已達上限',
    fromHotel: '從飯店出發',
    fromAirport: '從機場出發',
    freeTimeLoc: '🕒 自由活動時間',
    freeTimeDesc: '此行程已被移除，保留為彈性自由時間。您可以隨意探索周邊，或點擊「換一個」讓 AI 重新安排。',
    formSec1: '核心行程安排',
    formSec2: '旅客輪廓與預算',
    formSec3: '風格偏好與需求',
    markDone: '標記完成',
    actualTime: '完成時間',
    dominoShift: '自動順延',
    flightLockWarning: '安全鎖啟動：遇到跨國航班，航班時間已被鎖定無法順延，請留意搭機時間！',
    estTime: '(AI 預估)',
    options: {
      who: ['情侶', '家族 (有長者與小孩)', '朋友閨蜜', '獨旅'],
      pace: ['慢活 (睡到自然醒，一天1-2點)', '標準 (一天3-4點，含三餐)', '特種兵 (早出晚歸，打卡滿檔)'],
      why: ['放空耍廢', '🎡 主題遊樂園', '逛街血拚', '歷史文化', '🏔️ 上山下海 (大自然)', '美食狂熱', '👾 宅宅動漫文化'],
      budget: ['一般標準', '背包客窮遊', '輕奢享受', '土豪無上限'],
      transit: ['大眾運輸為主', '租車自駕', '全程計程車/包車']
    },
    locations: {
      "台灣": ["台北", "桃園", "台中", "台南", "高雄", "花東", "澎湖"],
      "日本": ["東京", "大阪/京都", "北海道", "沖繩", "福岡", "名古屋", "仙台"],
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
    swapPrompt: 'What kind of alternative?',
    swapOpts: { indoor: 'Indoor/Rain', relax: 'Need rest', food: 'Food/Drinks', any: 'AI Surprise', custom: '✏️ Specific Place' },
    customPlh: 'Where to? (e.g., Disney)',
    btnConfirm: 'OK',
    btnCancel: 'Cancel',
    swapping: 'Swapping...',
    max3: 'Max Reached',
    fromHotel: 'From Hotel',
    fromAirport: 'From Airport',
    freeTimeLoc: '🕒 Free Time',
    freeTimeDesc: 'This activity was removed. Enjoy your flexible free time, or click "AI Swap" to generate a new plan.',
    formSec1: 'Core Itinerary',
    formSec2: 'Traveler & Budget',
    formSec3: 'Style & Requests',
    markDone: 'Mark Done',
    actualTime: 'Actual Finish',
    dominoShift: 'Auto Shift',
    flightLockWarning: 'Safety Lock: International flight times are locked and cannot be shifted.',
    estTime: '(AI Est.)',
    options: {
      who: ['Couples', 'Family (with kids/elders)', 'Friends', 'Solo'],
      pace: ['Relaxed (1-2 spots/day)', 'Standard (3-4 spots/day)', 'Hardcore (Packed schedule)'],
      why: ['Relax & Chill', '🎡 Theme Parks', 'Shopping Spree', 'History & Culture', '🏔️ Nature & Outdoors', 'Foodie Craze', '👾 Anime & Geek Culture'],
      budget: ['Standard', 'Backpacker', 'Affordable Luxury', 'Unlimited'],
      transit: ['Public Transit', 'Rental Car', 'Taxi/Charter only']
    },
    locations: {
      "Taiwan": ["Taipei", "Taoyuan", "Taichung", "Tainan", "Kaohsiung", "Hualien/Taitung", "Penghu"],
      "Japan": ["Tokyo", "Osaka/Kyoto", "Hokkaido", "Okinawa", "Fukuoka", "Nagoya", "Sendai"],
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
    swapPrompt: 'どんな予定に変更しますか？',
    swapOpts: { indoor: '雨天/室内', relax: '休憩したい', food: '飲食', any: 'AI ランダム', custom: '✏️ 場所を指定' },
    customPlh: 'どこへ？ (例: 叙々苑)',
    btnConfirm: '確定',
    btnCancel: '取消',
    swapping: '変更中...',
    max3: '上限到達',
    fromHotel: 'ホテルから出発',
    fromAirport: '空港から出発',
    freeTimeLoc: '🕒 自由行動',
    freeTimeDesc: 'この予定は削除されました。自由な時間をお楽しみください。「AIで変更」をクリックして新しい予定を作成することもできます。',
    formSec1: '旅行の基本情報',
    formSec2: '旅行者と予算',
    formSec3: '旅行のスタイルと要望',
    markDone: '完了',
    actualTime: '実際の完了時間',
    dominoShift: '自動調整',
    flightLockWarning: '安全ロック：国際線のフライト時間は固定されており、ずらすことはできません。',
    estTime: '(AI 予想)',
    options: {
      who: ['カップル', '家族 (子供・シニア同伴)', '友人同士', '一人旅'],
      pace: ['のんびり (1日1-2箇所)', 'スタンダード (1日3-4箇所)', 'ハード (予定詰め込み)'],
      why: ['リラックス', '🎡 テーマパーク', 'ショッピング', '歷史・文化', '🏔️ 大自然・海山', 'グルメ滿喫', '👾 アニメ・オタク文化'],
      budget: ['スタンダード', 'バックパッカー', 'プチ贅沢', '無制限'],
      transit: ['公共交通機関メイン', 'レンタカー', 'タクシー・貸切のみ']
    },
    locations: {
      "台灣": ["台北", "桃園", "台中", "台南", "高雄", "花東", "澎湖"],
      "日本": ["東京", "大阪/京都", "北海道", "沖縄", "福岡", "名古屋", "仙台"],
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

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem('itinerary_master_state');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
};

// --- 時間運算工具 ---
const timeToMins = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (mins) => {
  let h = Math.floor(mins / 60) % 24;
  let m = mins % 60;
  if (h < 0) h += 24; 
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const checkTimeConflict = (act) => {
  if (!act.time || !act.operatingHours) return false;
  const oh = String(act.operatingHours);
  if (oh.includes('24') || oh.includes('確認')) return false;

  const match = oh.match(/(\d{1,2}:\d{2})\s*(?:-|~|至|到)\s*(\d{1,2}:\d{2})/);
  if (match) {
    let closeMins = timeToMins(match[2]);
    let arriveMins = timeToMins(act.time);
    if (closeMins < 360) closeMins += 1440; 
    if (arriveMins + 45 > closeMins) return true;
  }
  return false;
};

export default function App() {
  const savedState = loadSavedState();
  
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [lang, setLang] = useState(savedState?.lang || 'zh-TW');
  const t = LOCALES_DICT[lang];
  const locs = t.locations;
  const pdfRef = useRef(null);

  const [formData, setFormData] = useState(savedState?.formData || {
    who: t.options.who[0], 
    why: [t.options.why[5]],
    destCountry: '日本', destCity: '東京',
    depCountry: '台灣', depCity: '台北',
    dateFrom: today, dateTo: nextWeek,
    budget: t.options.budget[0], pace: t.options.pace[1], transit: t.options.transit[0],
    special: '', youtubeUrl: ''
  });

  const [step, setStep] = useState(savedState?.step || 1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isValidatingInputs, setIsValidatingInputs] = useState(false);
  
  const [logisticsData, setLogisticsData] = useState(savedState?.logisticsData || null);
  const [selectedFlight, setSelectedFlight] = useState(savedState?.selectedFlight || 0);
  const [selectedHotel, setSelectedHotel] = useState(savedState?.selectedHotel || 0);
  const [customOutboundFlight, setCustomOutboundFlight] = useState(savedState?.customOutboundFlight || '');
  const [customInboundFlight, setCustomInboundFlight] = useState(savedState?.customInboundFlight || '');
  const [customHotel, setCustomHotel] = useState(savedState?.customHotel || '');
  const [customHotelCity, setCustomHotelCity] = useState(savedState?.customHotelCity || '');
  const [itinerary, setItinerary] = useState(savedState?.itinerary || null);
  
  const [isEditingFlight, setIsEditingFlight] = useState(false);
  const [isEditingHotel, setIsEditingHotel] = useState(false);
  const [editFlightData, setEditFlightData] = useState({ outName: '', outDep: '', outArr: '', inName: '', inDep: '', inArr: '' });
  
  const [swappingNode, setSwappingNode] = useState(null);
  const [deletingNode, setDeletingNode] = useState(null);
  const [swapMenuOpenFor, setSwapMenuOpenFor] = useState(null); 
  const [showCustomInputFor, setShowCustomInputFor] = useState(null); 
  const [customSwapText, setCustomSwapText] = useState(''); 

  useEffect(() => {
    const stateToSave = { lang, formData, step, logisticsData, selectedFlight, selectedHotel, customOutboundFlight, customInboundFlight, customHotel, customHotelCity, itinerary };
    localStorage.setItem('itinerary_master_state', JSON.stringify(stateToSave));
  }, [lang, formData, step, logisticsData, selectedFlight, selectedHotel, customOutboundFlight, customInboundFlight, customHotel, customHotelCity, itinerary]);

  const handleReset = () => {
    if(step === 1 && !itinerary && !logisticsData) return;
    localStorage.removeItem('itinerary_master_state');
    setStep(1);
    setLogisticsData(null);
    setItinerary(null);
    setSelectedFlight(0);
    setSelectedHotel(0);
    setCustomOutboundFlight('');
    setCustomInboundFlight('');
    setCustomHotel('');
    setCustomHotelCity('');
    setEditFlightData({ outName: '', outDep: '', outArr: '', inName: '', inDep: '', inArr: '' });
  };

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
    const cleanDep = formData.depCity.split(/[ (/]/)[0];
    const cleanDest = formData.destCity.split(/[ (/]/)[0];
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
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) {
           throw new Error("伺服器連線次數達上限 (API Rate Limit Exceeded)。請等待 20~30 秒後再試一次！");
        }
        if (response.status === 403) {
           throw new Error("API 金鑰權限被阻擋 (403 Forbidden)。請至 Google Cloud Console 檢查 API Key 的「網站限制 (HTTP Referrers)」，確認是否有允許您目前的網址 (例如 http://localhost:5174/*)！");
        }
        throw new Error(`API: ${response.status} ${errorText}`);
      }
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
      JSON SCHEMA TO FOLLOW:
      {
        "flightOptions": [
          {"airline":"<String: Airline Name>", "outbound":"<String: HH:MM Origin -> HH:MM Dest>", "inbound":"<String: HH:MM Dest -> HH:MM Origin>", "priceEstimate":"<String: Price with currency>"}
        ],
        "hotelOptions": [
          {"name":"<String: Hotel Name>", "reason":"<String: Why recommend this>", "pricePerNight":"<String: Price with currency>", "officialLink":"<String: Booking link URL or empty>"}
        ]
      }`;
    
    try {
      const data = await callGemini(prompt, sysInst);
      if (!data.flightOptions || data.flightOptions.length === 0) throw new Error("AI returned no flights");
      setLogisticsData(data);
      setStep(3);
    } catch (e) { setErrorMsg('API Error: ' + e.message); setStep(1); }
  };

  const validateCustomInputs = async (outboundStr, inboundStr, hotelStr, destStr) => {
    if (!outboundStr && !inboundStr && !hotelStr) return { valid: true };
    const prompt = `Validate the following custom inputs for a trip to ${destStr}. Outbound Flight: "${outboundStr}". Inbound Flight: "${inboundStr}". Hotel: "${hotelStr}".`;
    const sysInst = `You are a strict data validator. Output ONLY JSON.
      CRITICAL MANDATE: All textual content MUST be written in ${targetLangStr}.
      CRITICAL MANDATE: Empty strings ("") mean the user chose the default option. This is PERFECTLY VALID. DO NOT fail validation because a field is empty.
      If a flight string is not empty, check if the format looks like a realistic flight number/time (e.g. "BR192"). If it's random garbage like "12345", it is invalid.
      If a hotel string is not empty, check if it's specific enough to locate in/near ${destStr}. If it's just a generic chain name like "APA" without a branch, it is invalid.
      
      JSON SCHEMA TO FOLLOW:
      {
        "valid": <Boolean: true if everything is valid, false if anything is invalid or ambiguous>,
        "reason": "<String: If valid is false, provide a clear, polite error message in ${targetLangStr} telling the user exactly what to fix. Empty if valid.>",
        "correctedOutbound": "<String: The outbound flight string to use. Fix typos if obvious, else return original.>",
        "correctedInbound": "<String: The inbound flight string to use. Fix typos if obvious, else return original.>",
        "correctedHotel": "<String: The hotel string to use. If it's a known hotel, return its full formal name to help Google Maps routing.>"
      }`;
    try {
      return await callGemini(prompt, sysInst);
    } catch (e) {
      return { valid: true, correctedOutbound: outboundStr, correctedInbound: inboundStr, correctedHotel: hotelStr };
    }
  };

  const handleGenerateItinerary = async () => {
    setErrorMsg('');
    const cf = logisticsData.flightOptions[selectedFlight], ch = logisticsData.hotelOptions[selectedHotel];
    
    let finalOutbound = customOutboundFlight.trim();
    let finalInbound = customInboundFlight.trim();
    let finalCustomHotel = customHotel.trim() ? `${customHotel.trim()}${customHotelCity.trim() ? ` (位於: ${customHotelCity.trim()})` : ''}` : '';

    if (finalOutbound || finalInbound || finalCustomHotel) {
      setIsValidatingInputs(true);
      const validationResult = await validateCustomInputs(finalOutbound, finalInbound, finalCustomHotel, getDestinationStr());
      setIsValidatingInputs(false);

      if (validationResult && validationResult.valid === false) {
        setErrorMsg(`⚠️ 驗證失敗: ${validationResult.reason}`);
        return; 
      }
      
      if (validationResult && validationResult.valid === true) {
         if (finalOutbound && validationResult.correctedOutbound) {
             finalOutbound = validationResult.correctedOutbound;
             setCustomOutboundFlight(finalOutbound);
         }
         if (finalInbound && validationResult.correctedInbound) {
             finalInbound = validationResult.correctedInbound;
             setCustomInboundFlight(finalInbound);
         }
         if (finalCustomHotel && validationResult.correctedHotel) {
             finalCustomHotel = validationResult.correctedHotel;
             setCustomHotel(finalCustomHotel);
         }
      }
    }

    setStep(4);
    
    let transcriptData = '';
    if (formData.youtubeUrl && formData.youtubeUrl.trim() !== '') {
      const urls = formData.youtubeUrl.split(/[\s,]+/).filter(u => u.trim().startsWith('http'));
      const failedUrls = [];
      const promises = urls.map(async (url) => {
        try {
          const res = await fetch(`/api/getTranscript?url=${encodeURIComponent(url)}`);
          const data = await res.json();
          if (!res.ok) {
            failedUrls.push(url);
            return null;
          }
          return data;
        } catch (e) {
          failedUrls.push(url);
          return null;
        }
      });
      const results = await Promise.all(promises);
      const successfulCount = results.filter(r => r && r.transcript).length;
      transcriptData = results.filter(r => r && r.transcript).map((r, i) => `[Video ${i+1}]: ${r.transcript}`).join('\n\n');
      
      if (failedUrls.length > 0) {
        let msg = '';
        if (successfulCount > 0) {
          msg += `✅ 已成功載入 ${successfulCount} 支影片的內容！\n\n`;
        }
        msg += `⚠️ 請注意，下列 ${failedUrls.length} 支影片未提供 CC 字幕，系統無法讀取，將自動忽略：\n${failedUrls.join('\n')}\n\n`;
        msg += `點擊確定後，系統將繼續為您規劃行程。`;
        alert(msg);
      }
    }
    
    const flightOutboundStr = finalOutbound ? finalOutbound : `${cf.airline} (${cf.outbound})`;
    const flightInboundStr = finalInbound ? finalInbound : `${cf.airline} (${cf.inbound})`;
    const finalFlightStr = `Outbound: ${flightOutboundStr}, Inbound: ${flightInboundStr}`;
    const finalHotelStr = finalCustomHotel ? finalCustomHotel : ch.name;
    const flightNameOnlyOutbound = finalOutbound ? finalOutbound : cf.airline;
    const flightNameOnlyInbound = finalInbound ? finalInbound : cf.airline;
    const flightOutboundTime = finalOutbound ? (editFlightData.outDep || "08:00") : cf.outbound;
    const flightInboundTime = finalInbound ? (editFlightData.inDep || "18:00") : cf.inbound;

    const prompt = `${getDepartureStr()} to ${getDestinationStr()} (${calculateDays()} days). Pace: ${formData.pace}. Styles: ${formData.why.join(' AND ')}. Budget: ${formData.budget}. Transit: ${formData.transit}. Flight: ${finalFlightStr}. Hotel: ${finalHotelStr}.${transcriptData ? `\nYouTube Transcript Inspiration: ${transcriptData}` : ''}`;
    
    // 🚀 核心大腦升級: 加入營業時間誠實條款 (Honest Operating Hours)
    const sysInst = `You are an elite, practical Local Expert Tour Guide. Output STRICT JSON. 
      CRITICAL MANDATE: All generated text MUST be entirely in ${targetLangStr}.
      CRITICAL MANDATE: 'costEstimate' MUST include the appropriate currency symbol.
      CRITICAL MANDATE: All integer values in 'budgetAnalysisPerPerson' MUST be in the local currency of the departure country (e.g., TWD if departing from Taiwan, USD for USA). DO NOT use the destination's currency for this overall budget analysis!
      CRITICAL MANDATE: You MUST generate EXACTLY ${calculateDays()} days in the "dailyPlan" array. DO NOT just output 1 day.
      
      --- 🛑 CORE EXPERT LOGIC & CONSTRAINTS 🛑 ---
      0. USER CUSTOM REQUIREMENTS (HIGHEST PRIORITY): ${formData.special.trim() ? `The user has explicitly requested: "${formData.special}". YOU MUST PRIORITIZE THIS INSTRUCTION over all other suggestions. If they mention specific cities (e.g., Osaka, Kyoto, Nara), you MUST include them. If they mention specific passes (e.g., Osaka Amazing Pass), you MUST optimize the itinerary to use its free facilities.` : "None."}
      1. GEO-CLUSTERING (IMPORTANT): If the destination covers multiple cities or a large region (e.g., "Osaka/Kyoto" or "Tokyo"), YOU MUST GROUP consecutive days by area. DO NOT cross city or distant regional borders back-and-forth within the same day. Example: Day 1-2 Kyoto, Day 3-5 Osaka.
      2. TIME-PHYSICS ENGINE: You MUST leave realistic time gaps between activities for transportation and actual enjoyment based on the user's pace ("${formData.pace}"). DO NOT schedule back-to-back activities with 0 transit time unless they are literally in the same building.
      3. LOGISTICAL DEPTH: In "detailedInstruction", YOU MUST provide exact transit methods. State the specific train/subway lines to take, exits to use, or realistic walking times. No generic fluff.
      4. SPECIFICITY MANDATE (CRITICAL): YOU MUST recommend EXACT, SPECIFIC shop or restaurant names. NEVER use generic area names like "道頓堀當地美食", "心齋橋逛街", or "黑門市場小吃". Instead, specify the exact establishment, e.g., "千房大阪燒 道頓堀店", "任天堂旗艦店 大阪", or "黑門三平 海鮮生魚片". The user must know the exact target destination to navigate to.
      5. MEALS: Schedule 3 meals (type: "food") every single day at culturally appropriate times, using the Specificity Mandate.
      6. HONEST OPERATING HOURS: For "operatingHours", if it's a known 24-hour place (e.g., Ichiran Ramen, Don Quijote, convenience stores, parks, airports), explicitly output "24小時營業" or "24 Hours". If you are NOT 100% certain about the exact hours, output "建議出發前至地圖或官網確認" instead of faking hours.
      7. RESTAURANT PRIORITY: Generally, plan food/restaurants based on proximity to attractions. HOWEVER, if the user's Styles include "美食" or "Food", YOU MUST reverse this: treat highly-rated or influencer-famous (網紅推薦) restaurants as the MAIN destination and plan minor attractions around them.
      8. BUDGET TIERING & TRENDS: The user's budget is "${formData.budget}". Scale recommendations and Social Media Trends (網紅推薦) accordingly:
         - Backpacker: Highly-rated street food, hidden gems, free 'Instagrammable' photo spots.
         - Standard: Viral TikTok/Instagram spots, popular tourist restaurants, trendy cafes.
         - Affordable Luxury: Aesthetic boutique cafes, high-end afternoon tea, premium dining.
         - Unlimited: Exclusive VIP spots, celebrity-frequented fine dining, luxury experiences.
         The 'costEstimate' and overall budget MUST mathematically reflect this lifestyle.
      9. TRANSCRIPT VETO PROTOCOL: If "YouTube Transcript Inspiration" is provided in the prompt, extract locations/restaurants from it, but NEVER blindly copy them. Apply the "Triangular Veto":
         - Veto 1 (User Needs): User's custom request ("${formData.special}") has ABSOLUTE Supremacy. Drop any transcript spots that violate it.
         - Veto 2 (Budget): Drop transcript spots that violate the user's budget tier ("${formData.budget}").
         - Veto 3 (Physics): Drop transcript spots that break geographic clustering or realistic transit times.
         Fill the gaps with your own expert knowledge to make a seamless, realistic itinerary.
         CRITICAL RULE: If you successfully include a spot or restaurant inspired by the YouTube Transcript, YOU MUST EXPLICITLY state this in its 'expertReason' field AND explain why it passed your LLM judgment (e.g., "根據您提供的 YouTube 影片推薦，經過評估，這家高 CP 值小吃完美符合您的【背包客】預算設定...").

      --- 🛑 BOUNDARY EVENTS 🛑 ---
      1. Day 1, Activity 1 MUST be type="transit". The location MUST be "從家中出發前往機場". Calculate a time exactly 3 hours prior to the flight time (${flightOutboundTime}). The 'detailedInstruction' MUST mention taking the Outbound Flight (${flightNameOnlyOutbound}).
      2. Day 1, Activity 2 MUST be type="transit" representing the realistic journey from the destination airport to the Hotel (${finalHotelStr}). IMPORTANT: You MUST calculate a time 1 to 1.5 hours AFTER the flight landing time to account for immigration and customs clearance before starting this journey!
      3. The SECOND TO LAST activity on the LAST day MUST be type="transit" representing the realistic journey from Hotel/City to the destination airport.
      4. The LAST activity on the LAST day MUST be type="transit" representing taking the Inbound Flight (Flight: ${flightNameOnlyInbound}, Time: ${flightInboundTime}) and returning home.
      
      JSON SCHEMA TO FOLLOW:
      {
        "summary":"<String: Overall 50-word summary emphasizing the flow and clustering>", 
        "budgetAnalysisPerPerson":{
          "flight": <Integer: purely number>, "hotel": <Integer>, "food": <Integer>, "transport": <Integer>, "tickets": <Integer>, "total": <Integer>
        }, 
        "recommendedPasses":[{"passName":"<String>", "reason":"<String>", "buyLink":"<String: URL or empty>"}], 
        "dailyPlan":[
          {
            "day": <Integer: Day number>,
            "date":"<String: YYYY-MM-DD>",
            "theme":"<String: Daily theme emphasizing the clustered area>",
            "activities":[
              {
                "time":"<String: HH:MM>",
                "type":"<String: 'food', 'attraction', 'transit', or 'hotel'>",
                "location":"<String: Exact Location Name>",
                "operatingHours":"<String: Honest operating hours or 24h indication>",
                "detailedInstruction":"<String: Detailed action and EXACT routing/transit guide, 80+ words>",
                "expertReason":"<String: Why this makes sense in the current geographic cluster, 50+ words>",
                "officialLink":"<String: URL or empty>",
                "ticketRequired": <Boolean: true if this activity/transit likely requires a paid ticket or pass>,
                "ticketSearchKeyword":"<String: If ticketRequired is true, provide a SHORT, precise keyword for Klook/KKday search (e.g. 'Kansai Airport Haruka', 'Universal Studios Japan'). Empty if false.>",
                "costEstimate":"<String: Cost with currency symbol>"
              }
            ]
          }
        ]
      }
      CRITICAL: All values in budgetAnalysisPerPerson MUST BE INTEGERS. NO COMMAS, NO CURRENCY SYMBOLS.`;
      
    try {
      setItinerary(await callGemini(prompt, sysInst));
      setStep(5);
    } catch (e) { setErrorMsg('API Error: Timeout or format error.'); setStep(3); }
  };

  const handleDeleteNode = (dayIdx, actIdx) => {
    const nodeKey = `${dayIdx}-${actIdx}`;
    if (deletingNode === nodeKey) {
      const newItin = { ...itinerary };
      const currentAct = newItin.dailyPlan[dayIdx].activities[actIdx];
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
      setDeletingNode(nodeKey);
      setTimeout(() => {
        setDeletingNode(current => current === nodeKey ? null : current);
      }, 3000);
    }
  };

  const handleSwapNode = async (dayIdx, actIdx, intent, customInput = '') => {
    setSwapMenuOpenFor(null); 
    setShowCustomInputFor(null);
    setCustomSwapText(''); 
    setSwappingNode(`${dayIdx}-${actIdx}`); 
    
    const day = itinerary.dailyPlan[dayIdx];
    const targetAct = day.activities[actIdx];
    const prevActObj = actIdx > 0 ? day.activities[actIdx - 1] : null;
    const prevActTime = prevActObj ? (prevActObj.actualEndTime || prevActObj.time) : "08:00";
    const prevAct = prevActObj ? `Location: ${renderText(prevActObj.location)} (Ends at ${prevActTime})` : "Start of day (08:00)";
    const nextActObj = actIdx < day.activities.length - 1 ? day.activities[actIdx + 1] : null;
    const nextAct = nextActObj ? `Location: ${renderText(nextActObj.location)} (Starts at ${nextActObj.time})` : "End of day";

    let intentContext = "USER INTENT: Provide a good general alternative that fits the geographic flow of this day.";
    let targetType = targetAct.type === 'transit' ? 'attraction' : targetAct.type;

    if (intent === 'indoor') {
      intentContext = "USER INTENT: The user specifically requested an INDOOR or RAINY DAY BACKUP activity. Must be weather-proof and geographically nearby.";
      targetType = 'attraction';
    } else if (intent === 'relax') {
      intentContext = "USER INTENT: The user is tired and specifically requested a very RELAXING, low-physical-effort activity nearby.";
      targetType = 'attraction';
    } else if (intent === 'food') {
      intentContext = "USER INTENT: The user specifically requested a FOOD or BEVERAGE stop in the current vicinity.";
      targetType = 'food';
    } else if (intent === 'custom' && customInput.trim()) {
      intentContext = `USER INTENT: The user explicitly requested to go to exactly this location/activity: "${customInput}". You MUST set the location to this requested place (or its closest realistic equivalent), calculate the transit, and provide details. If geographically absurd based on the current cluster, explain why in 'expertReason'.`;
      targetType = 'attraction'; 
    }

    const prompt = `City: ${getDestinationStr()}. Context: Day ${day.day}. Previous: ${prevAct}. Next: ${nextAct}. Styles: ${formData.why.join(', ')}.
      Do NOT go to "${renderText(targetAct.location)}" at ${targetAct.time}.
      ${intentContext}
      Suggest ONE alternative activity (type: ${targetType}). Ensure realistic transit physics.`;

    const sysInst = `Output ONLY a single JSON object. 
      CRITICAL MANDATE: Output MUST be entirely in ${targetLangStr}.
      CRITICAL MANDATE: For "operatingHours", if it's a 24-hour place, explicitly output "24小時營業" or "24 Hours". If unsure, output "建議至官網或地圖確認" instead of making up fake hours.
      JSON SCHEMA TO FOLLOW:
      {
        "time":"<String: Calculate start HH:MM based on transit from Previous activity>",
        "actualEndTime":"<String: Calculate end HH:MM based on duration of this activity>",
        "type":"${targetType}", 
        "location":"<String: Alternative Name>", 
        "operatingHours":"<String: Honest hours or 24h indication>", 
        "detailedInstruction":"<String: 80+ words instruction with transit details>", 
        "expertReason":"<String: 50+ words insights>", 
        "officialLink":"<String: URL or empty>", 
        "costEstimate":"<String: Cost with currency>"
      }`;

    try {
      const newActivity = await callGemini(prompt, sysInst);
      const newItin = { ...itinerary };
      newItin.dailyPlan[dayIdx].activities[actIdx] = newActivity;
      
      // Calculate time difference to shift subsequent nodes if the end time changed
      if (newActivity.actualEndTime && targetAct.actualEndTime) {
        let diffMins = timeToMins(newActivity.actualEndTime) - timeToMins(targetAct.actualEndTime);
        if (diffMins < -720) diffMins += 1440;
        if (diffMins > 720) diffMins -= 1440;
        
        if (diffMins !== 0) {
          for (let i = actIdx + 1; i < newItin.dailyPlan[dayIdx].activities.length; i++) {
            const nextNode = newItin.dailyPlan[dayIdx].activities[i];
            if (nextNode.time) nextNode.time = minsToTime(timeToMins(nextNode.time) + diffMins);
            if (nextNode.actualEndTime) nextNode.actualEndTime = minsToTime(timeToMins(nextNode.actualEndTime) + diffMins);
          }
        }
      } else if (newActivity.time && targetAct.time) {
        let diffMins = timeToMins(newActivity.time) - timeToMins(targetAct.time);
        if (diffMins !== 0) {
          for (let i = actIdx + 1; i < newItin.dailyPlan[dayIdx].activities.length; i++) {
            const nextNode = newItin.dailyPlan[dayIdx].activities[i];
            if (nextNode.time) nextNode.time = minsToTime(timeToMins(nextNode.time) + diffMins);
            if (nextNode.actualEndTime) nextNode.actualEndTime = minsToTime(timeToMins(nextNode.actualEndTime) + diffMins);
          }
        }
      }
      
      setItinerary(newItin);
    } catch (error) {
      alert(lang === 'zh-TW' ? "AI 替換失敗，請再試一次。" : "Swap failed. Try again.");
    } finally {
      setSwappingNode(null);
      setDeletingNode(null); 
    }
  };

  // --- 【一鍵自動同步引擎 (Auto-Sync Domino Engine)】 ---
  const handleShiftFromNode = (dayIdx, actIdx, shiftMins) => {
    const newItin = { ...itinerary };
    const day = newItin.dailyPlan[dayIdx];
    
    if (day.activities[actIdx].actualEndTime) {
       day.activities[actIdx].actualEndTime = minsToTime(timeToMins(day.activities[actIdx].actualEndTime) + shiftMins);
    }

    for (let i = actIdx + 1; i < day.activities.length; i++) {
      const nextAct = day.activities[i];
      const isBoundary = (dayIdx === 0 && i === 0) || (dayIdx === itinerary.dailyPlan.length - 1 && i === day.activities.length - 1);
      
      if (isBoundary) {
        alert(t.flightLockWarning);
        break; 
      }
      
      if (nextAct.time) {
        nextAct.time = minsToTime(timeToMins(nextAct.time) + shiftMins);
      }
      if (nextAct.actualEndTime) {
        nextAct.actualEndTime = minsToTime(timeToMins(nextAct.actualEndTime) + shiftMins);
      }
    }
    setItinerary(newItin);
  };

  const handleActualTimeChange = (dayIdx, actIdx, newTime) => {
    const act = itinerary.dailyPlan[dayIdx].activities[actIdx];
    const oldTime = act.actualEndTime;

    if (oldTime && newTime) {
      let diffMins = timeToMins(newTime) - timeToMins(oldTime);
      if (diffMins < -720) diffMins += 1440;
      if (diffMins > 720) diffMins -= 1440;
      if (diffMins !== 0) handleShiftFromNode(dayIdx, actIdx, diffMins);
    }
  };

  const handleFlightShiftSave = () => {
    const { outName, outArr, inName, inDep } = editFlightData;
    let finalOut = outName;
    if (outArr) finalOut += ` (落地 ${outArr})`;
    let finalIn = inName;
    if (inDep) finalIn += ` (起飛 ${inDep})`;
    setCustomOutboundFlight(finalOut);
    setCustomInboundFlight(finalIn);
    setIsEditingFlight(false);

    if (outArr && itinerary && itinerary.dailyPlan[0]?.activities?.length > 0) {
      const newItin = { ...itinerary };
      const day = newItin.dailyPlan[0];
      
      const matchOldArr = customOutboundFlight.match(/落地 (\d{2}:\d{2})/);
      const oldArrTime = matchOldArr ? matchOldArr[1] : day.activities[0].time;
      let diffMins = timeToMins(outArr) - timeToMins(oldArrTime);
      
      if (diffMins !== 0) {
        for (let i = 0; i < day.activities.length; i++) {
          const nextAct = day.activities[i];
          if (nextAct.time) nextAct.time = minsToTime(timeToMins(nextAct.time) + diffMins);
          if (nextAct.actualEndTime) nextAct.actualEndTime = minsToTime(timeToMins(nextAct.actualEndTime) + diffMins);
        }
        setItinerary(newItin);
      }
    }
  };

  const handleToggleComplete = (dayIdx, actIdx) => {
    const newItin = { ...itinerary };
    const act = newItin.dailyPlan[dayIdx].activities[actIdx];
    act.isCompleted = !act.isCompleted;
    
    if (act.isCompleted && !act.actualEndTime) {
      const nextAct = newItin.dailyPlan[dayIdx].activities[actIdx + 1];
      if (nextAct && nextAct.time) {
          act.actualEndTime = nextAct.time; 
      } else if (act.time) {
          act.actualEndTime = minsToTime(timeToMins(act.time) + 60); 
      } else {
          act.actualEndTime = "12:00"; 
      }
    }
    setItinerary(newItin);
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

  const getKlookUrl = (query) => {
    const l = lang === 'ja' ? 'ja' : (lang === 'en' ? 'en-US' : 'zh-TW');
    return `https://www.klook.com/${l}/search/result/?query=${encodeURIComponent(query + ' ' + formData.destCity)}`;
  };
  const getKkdayUrl = (query) => {
    const l = lang === 'ja' ? 'ja' : (lang === 'en' ? 'en' : 'zh-tw');
    return `https://www.kkday.com/${l}/product/productlist?word=${encodeURIComponent(query + ' ' + formData.destCity)}`;
  };

  const getRouteUrl = (dayIdx, actIdx, activities, hotelName) => {
    if (dayIdx === 0 && actIdx === 0) return null; 
    if (dayIdx === itinerary.dailyPlan.length - 1 && actIdx === activities.length - 1) return null;
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
                <h1 className="text-3xl font-extrabold text-white tracking-tight cursor-pointer drop-shadow-md" onClick={handleReset}>{t.title}</h1>
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

                  <div className="grid grid-cols-1 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-bold flex items-center gap-2 text-slate-400"/> {t.transit}
                      <select name="transit" value={formData.transit} onChange={handleChange} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300">{t.options.transit.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2">🌟 {lang === 'zh-TW' ? '核心自訂行程與特殊需求 (選填)' : (lang === 'ja' ? 'カスタム旅程・特別な要望 (任意)' : 'Custom Itinerary & Special Requirements (Optional)')}</h3>
                  <p className="text-sm text-slate-500 font-medium">{lang === 'zh-TW' ? 'AI 將優先把您的這段話作為排定行程的絕對核心骨幹。' : 'AI will prioritize this as the core logic for generating your itinerary.'}</p>
                  <textarea name="special" value={formData.special} onChange={handleChange} rows={4} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-indigo-300 resize-none" placeholder={lang === 'zh-TW' ? '例如：想去大阪、京都、奈良，主要想逛街與去主題樂園，並想使用大阪周遊券的各項免費設施...' : 'e.g. I want to visit Osaka, Kyoto, and Nara, focusing on shopping and theme parks...'}></textarea>
                  
                  <div className="pt-4 border-t border-slate-200/60 mt-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">▶️ {lang === 'zh-TW' ? 'YouTube 參考影片網址 (可貼多個)' : 'YouTube Reference URLs'}</h4>
                    <p className="text-xs text-slate-500 mb-3">{lang === 'zh-TW' ? '貼上 YouTube Vlog 網址 (多個網址請用空格或換行分隔)，AI 會自動萃取所有影片內的精華並融合您的需求！' : 'Paste YouTube Vlog URLs (separated by space/newline). AI will extract hidden gems from all of them!'}</p>
                    <textarea name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} rows={2} placeholder="https://www.youtube.com/watch?v=...&#10;https://www.youtube.com/watch?v=..." className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/20 outline-none text-slate-800 shadow-sm transition-all hover:border-red-300 resize-none"></textarea>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white h-full">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6"><PlaneTakeoff className="w-6 h-6 text-blue-600" /> {t.step2Title}</h3>
                <div className="grid grid-cols-1 auto-rows-max gap-6">
                <div className={`h-[340px] p-6 rounded-[1.5rem] border-2 transition-all flex flex-col justify-center ${(editFlightData.outName.trim() || editFlightData.inName.trim()) ? 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-500/20' : 'border-slate-200 bg-white'}`}>
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <PlaneTakeoff className="w-4 h-4 text-blue-500" /> 
                    {lang === 'zh-TW' ? '自選航班編號 (選填)' : (lang === 'ja' ? 'カスタムフライト番号 (任意)' : 'Custom Flight Number (Optional)')}
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
                      <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-400 block mb-1">{t.outbound || '去程'}</label>
                        <input type="text" value={editFlightData.outName} onChange={(e) => {
                           setEditFlightData(p=>({...p, outName: e.target.value}));
                           setCustomOutboundFlight(e.target.value + (editFlightData.outDep ? ` (起飛 ${editFlightData.outDep})` : '') + (editFlightData.outArr ? ` (落地 ${editFlightData.outArr})` : ''));
                        }} placeholder={lang === 'zh-TW' ? '例: BR192' : 'e.g. BR192'} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-800 transition-all hover:border-blue-300" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-400 block mb-1">起飛時間</label>
                        <input type="time" value={editFlightData.outDep} onChange={(e) => {
                           setEditFlightData(p=>({...p, outDep: e.target.value}));
                           setCustomOutboundFlight(editFlightData.outName + (e.target.value ? ` (起飛 ${e.target.value})` : '') + (editFlightData.outArr ? ` (落地 ${editFlightData.outArr})` : ''));
                        }} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-800 transition-all hover:border-blue-300" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-400 block mb-1">落地時間</label>
                        <input type="time" value={editFlightData.outArr} onChange={(e) => {
                           setEditFlightData(p=>({...p, outArr: e.target.value}));
                           setCustomOutboundFlight(editFlightData.outName + (editFlightData.outDep ? ` (起飛 ${editFlightData.outDep})` : '') + (e.target.value ? ` (落地 ${e.target.value})` : ''));
                        }} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-800 transition-all hover:border-blue-300" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
                      <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-400 block mb-1">{t.inbound || '回程'}</label>
                        <input type="text" value={editFlightData.inName} onChange={(e) => {
                           setEditFlightData(p=>({...p, inName: e.target.value}));
                           setCustomInboundFlight(e.target.value + (editFlightData.inDep ? ` (起飛 ${editFlightData.inDep})` : '') + (editFlightData.inArr ? ` (落地 ${editFlightData.inArr})` : ''));
                        }} placeholder={lang === 'zh-TW' ? '例: BR191' : 'e.g. BR191'} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-800 transition-all hover:border-blue-300" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-400 block mb-1">起飛時間</label>
                        <input type="time" value={editFlightData.inDep} onChange={(e) => {
                           setEditFlightData(p=>({...p, inDep: e.target.value}));
                           setCustomInboundFlight(editFlightData.inName + (e.target.value ? ` (起飛 ${e.target.value})` : '') + (editFlightData.inArr ? ` (落地 ${editFlightData.inArr})` : ''));
                        }} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-800 transition-all hover:border-blue-300" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-400 block mb-1">落地時間</label>
                        <input type="time" value={editFlightData.inArr} onChange={(e) => {
                           setEditFlightData(p=>({...p, inArr: e.target.value}));
                           setCustomInboundFlight(editFlightData.inName + (editFlightData.inDep ? ` (起飛 ${editFlightData.inDep})` : '') + (e.target.value ? ` (落地 ${e.target.value})` : ''));
                        }} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-800 transition-all hover:border-blue-300" />
                      </div>
                    </div>
                  </div>
                </div>
                  {logisticsData.flightOptions?.map((flight, idx) => {
                    const isFlightHighlighted = selectedFlight === idx && !editFlightData.outName.trim() && !editFlightData.inName.trim();
                    return (
                    <div key={idx} onClick={() => {
                       setSelectedFlight(idx);
                       setEditFlightData({ outName: '', outDep: '', outArr: '', inName: '', inDep: '', inArr: '' });
                       setCustomOutboundFlight('');
                       setCustomInboundFlight('');
                    }} className={`h-[260px] p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all flex flex-col justify-between ${isFlightHighlighted ? 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300 bg-white hover:shadow-md'}`}>
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
                  )})}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white h-full">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6"><Bed className="w-6 h-6 text-pink-600" /> {t.step3Title}</h3>
                <div className="grid grid-cols-1 auto-rows-max gap-6">
                <div className={`h-[340px] p-6 rounded-[1.5rem] border-2 transition-all flex flex-col justify-center ${customHotel.trim() ? 'border-pink-500 bg-pink-50 shadow-lg ring-4 ring-pink-500/20' : 'border-slate-200 bg-white'}`}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">
                        {lang === 'zh-TW' ? '飯店名稱' : (lang === 'ja' ? 'ホテル名' : 'Hotel Name')}
                      </label>
                      <input type="text" value={customHotel} onChange={(e) => setCustomHotel(e.target.value)} placeholder={lang === 'zh-TW' ? '例：東京車站大飯店' : 'e.g. Tokyo Station Hotel'} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-800 transition-all hover:border-pink-300" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">
                        {lang === 'zh-TW' ? '所在城市' : (lang === 'ja' ? '都市' : 'City')}
                      </label>
                      <input type="text" value={customHotelCity} onChange={(e) => setCustomHotelCity(e.target.value)} placeholder={lang === 'zh-TW' ? '例：東京' : 'e.g. Tokyo'} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-800 transition-all hover:border-pink-300" />
                    </div>
                  </div>
                </div>
                  {logisticsData.hotelOptions?.map((hotel, idx) => {
                    const isHotelHighlighted = selectedHotel === idx && !customHotel.trim();
                    return (
                    <div key={idx} onClick={() => {
                       setSelectedHotel(idx);
                       setCustomHotel('');
                       setCustomHotelCity('');
                    }} className={`h-[260px] p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all flex flex-col justify-between ${isHotelHighlighted ? 'border-pink-500 bg-pink-50 shadow-lg ring-4 ring-pink-500/20' : 'border-slate-200 hover:border-pink-300 bg-white hover:shadow-md'}`}>
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
                  )})}
                </div>
              </div>
            </div>
            {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold">{errorMsg}</div>}
            <div className="flex justify-center mt-10">
              <button onClick={handleGenerateItinerary} disabled={isValidatingInputs} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-black text-xl py-5 px-16 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 transition-all flex items-center gap-3 border border-indigo-400/50">
                {isValidatingInputs ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />} 
                {isValidatingInputs ? (lang === 'zh-TW' ? '資料核實中...' : 'Validating...') : t.btnGen}
              </button>
            </div>
          </div>
        )}

        {step === 5 && itinerary && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex flex-wrap justify-between items-center gap-4 print:hidden px-2">
              <button onClick={() => setStep(3)} className="text-white font-bold hover:text-blue-100 flex items-center gap-2 bg-slate-900/50 px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-sm transition-colors">{t.reselect}</button>
              <button onClick={handleDownloadPDF} disabled={isPdfLoading} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 border border-slate-700">
                {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {t.print}
              </button>
            </div>

            <div ref={pdfRef} className="space-y-8 print:bg-white print:p-0">
              
              <div className="bg-gradient-to-br from-indigo-900/95 via-slate-900/95 to-blue-900/95 backdrop-blur-2xl p-6 md:p-12 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden print:bg-slate-900 print:text-white print:break-inside-avoid border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Compass className="w-64 h-64" /></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-bold px-5 py-2.5 rounded-full text-sm mb-6 border border-white/30 shadow-sm">
                    <Calendar className="w-4 h-4" /> {formData.dateFrom} - {formData.dateTo} ({calculateDays()} Days)
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-100 drop-shadow-sm">
                    {formData.destCity} {t.dailyPlan}
                  </h2>
                  <p className="text-base md:text-xl text-blue-50 font-medium mb-10 max-w-3xl leading-relaxed border-l-4 border-blue-400 pl-4 md:pl-5">
                    {renderText(itinerary.summary)}
                  </p>

                  {logisticsData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:grid-cols-2">
                      <div className="bg-white/10 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-white/20 shadow-inner relative group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-blue-200"><PlaneTakeoff className="w-5 h-5"/> <span className="font-bold uppercase tracking-wider text-xs">Confirmed Flight</span></div>
                          <button onClick={() => {
                            const matchOut = customOutboundFlight.match(/落地 (\d{2}:\d{2})/);
                            const parsedArr = matchOut ? matchOut[1] : '';
                            const matchIn = customInboundFlight.match(/起飛 (\d{2}:\d{2})/);
                            const parsedDep = matchIn ? matchIn[1] : '';
                            setEditFlightData({ 
                               outName: customOutboundFlight.split(' (')[0] || '', 
                               outArr: parsedArr, 
                               inName: customInboundFlight.split(' (')[0] || '',
                               inDep: parsedDep
                            });
                            setIsEditingFlight(!isEditingFlight);
                          }} className="text-blue-200 hover:text-white p-1.5 rounded-lg transition-colors print:hidden opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20"><Edit2 className="w-4 h-4"/></button>
                        </div>
                        
                        {isEditingFlight ? (
                          <div className="space-y-3 mt-2 animate-in fade-in zoom-in-95">
                            <div className="flex gap-2">
                               <input type="text" value={editFlightData.outName} onChange={(e) => setEditFlightData(p => ({...p, outName: e.target.value}))} placeholder="去程航班 (例: BR192)" className="flex-1 text-sm p-2.5 bg-black/40 text-white placeholder-blue-200/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                               <input type="time" value={editFlightData.outArr} onChange={(e) => setEditFlightData(p => ({...p, outArr: e.target.value}))} className="w-28 text-sm p-2.5 bg-black/40 text-white border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-blue-400" title="實際落地時間 (將連動推移行程)" />
                            </div>
                            <div className="flex gap-2">
                               <input type="text" value={editFlightData.inName} onChange={(e) => setEditFlightData(p => ({...p, inName: e.target.value}))} placeholder="回程航班 (例: BR191)" className="flex-1 text-sm p-2.5 bg-black/40 text-white placeholder-blue-200/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                               <input type="time" value={editFlightData.inDep} onChange={(e) => setEditFlightData(p => ({...p, inDep: e.target.value}))} className="w-28 text-sm p-2.5 bg-black/40 text-white border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-blue-400" title="實際起飛時間" />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={handleFlightShiftSave} className="flex-1 text-sm font-bold bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-sm">儲存並推移行程</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-black text-white text-xl">{(customOutboundFlight.trim() || customInboundFlight.trim()) ? "Custom Flights" : renderText(logisticsData.flightOptions[selectedFlight]?.airline)}</p>
                            <div className="mt-3 space-y-1.5">
                              <p className="text-sm text-blue-50 font-medium bg-black/20 px-3 py-1.5 rounded-lg inline-block">🛫 {t.outbound}: {customOutboundFlight.trim() ? customOutboundFlight.trim() : renderText(logisticsData.flightOptions[selectedFlight]?.outbound)}</p>
                              <br />
                              <p className="text-sm text-blue-50 font-medium bg-black/20 px-3 py-1.5 rounded-lg inline-block">🛬 {t.inbound}: {customInboundFlight.trim() ? customInboundFlight.trim() : renderText(logisticsData.flightOptions[selectedFlight]?.inbound)}</p>
                            </div>
                            <a href={getGoogleFlightsUrl()} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-xs font-bold bg-blue-500/40 hover:bg-blue-500/60 px-4 py-2 rounded-xl transition-colors border border-blue-400/50 print:hidden">{t.flightGoogle}</a>
                          </>
                        )}
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-white/20 shadow-inner relative group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-pink-200"><Bed className="w-5 h-5"/> <span className="font-bold uppercase tracking-wider text-xs">Confirmed Hotel</span></div>
                          <button onClick={() => setIsEditingHotel(!isEditingHotel)} className="text-pink-200 hover:text-white p-1.5 rounded-lg transition-colors print:hidden opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20"><Edit2 className="w-4 h-4"/></button>
                        </div>
                        
                        {isEditingHotel ? (
                          <div className="space-y-3 mt-2 animate-in fade-in zoom-in-95">
                            <input type="text" value={customHotel} onChange={(e) => setCustomHotel(e.target.value)} placeholder={`飯店名稱 (例如: ${renderText(logisticsData.hotelOptions[selectedHotel]?.name)})`} className="w-full text-sm p-2.5 bg-black/40 text-white placeholder-pink-200/50 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-pink-400" />
                            <div className="flex gap-2">
                              <button onClick={() => setIsEditingHotel(false)} className="flex-1 text-sm font-bold bg-pink-500 text-white py-2.5 rounded-xl hover:bg-pink-600 transition-colors shadow-sm">儲存</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-black text-white text-xl">{customHotel.trim() ? customHotel.trim() : renderText(logisticsData.hotelOptions[selectedHotel]?.name)}</p>
                            {!customHotel.trim() && (
                              <p className="text-sm text-blue-50/90 mt-3 leading-relaxed">{renderText(logisticsData.hotelOptions[selectedHotel]?.reason)}</p>
                            )}
                            {!customHotel.trim() && logisticsData.hotelOptions[selectedHotel]?.officialLink && (
                              <a href={logisticsData.hotelOptions[selectedHotel].officialLink} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-xs font-bold bg-pink-500/40 hover:bg-pink-500/60 px-4 py-2 rounded-xl transition-colors border border-pink-400/50 print:hidden">{t.officialLink}</a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {itinerary.budgetAnalysisPerPerson && (
                <div className="bg-white/90 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white print:border-2 print:border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3"><Wallet className="w-6 h-6 md:w-7 md:h-7 text-green-500" /> {t.budgetTitle}</h3>
                    <div className="text-right">
                      <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">{t.budgetTotal}</p>
                      <p className="text-2xl md:text-4xl font-black text-indigo-600 drop-shadow-sm">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.total))}</p>
                    </div>
                  </div>
                  <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner mb-8">
                    <div className="bg-blue-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.flight) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-pink-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.hotel) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-orange-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.food) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-indigo-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.tickets) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                    <div className="bg-slate-400 h-full" style={{ width: `${(safeNum(itinerary.budgetAnalysisPerPerson.transport) / (safeNum(itinerary.budgetAnalysisPerPerson.total)||1)) * 100}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 text-sm font-medium">
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-blue-500 flex items-center gap-1.5 mb-1"><PlaneTakeoff className="w-4 h-4"/>Flight</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.flight))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-pink-500 flex items-center gap-1.5 mb-1"><Bed className="w-4 h-4"/>Hotel</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.hotel))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-orange-500 flex items-center gap-1.5 mb-1"><Coffee className="w-4 h-4"/>Food</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.food))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-indigo-500 flex items-center gap-1.5 mb-1"><Ticket className="w-4 h-4"/>Tickets</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.tickets))}</span></div>
                    <div className="flex flex-col bg-white/80 p-3 rounded-xl border border-slate-100"><span className="text-slate-500 flex items-center gap-1.5 mb-1"><Train className="w-4 h-4"/>Transit</span> <span className="text-slate-800 font-bold text-lg">{formatCurrency(safeNum(itinerary.budgetAnalysisPerPerson.transport))}</span></div>
                  </div>
                </div>
              )}

              {itinerary.recommendedPasses && itinerary.recommendedPasses.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50/95 to-blue-50/95 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] border border-white shadow-xl print:hidden">
                  <h3 className="text-xl font-black text-indigo-900 flex items-center gap-3 mb-6">
                    <Ticket className="w-6 h-6 text-indigo-600" /> Recommended Passes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {itinerary.recommendedPasses.map((pass, idx) => (
                      <div key={idx} className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-white hover:shadow-md transition-shadow">
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

              <div className="space-y-8 md:space-y-10">
                {itinerary.dailyPlan?.map((day, idx) => (
                  <div key={idx} className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80 overflow-hidden print:border-2 print:border-slate-300 print:break-inside-avoid print:shadow-none print:mt-4">
                    
                    <div className="bg-slate-900/95 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 print:bg-slate-100">
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="bg-indigo-500 text-white font-black text-xl md:text-2xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-[1.25rem] md:rounded-[1.5rem] shadow-lg print:bg-indigo-100 print:text-indigo-900 print:border print:border-indigo-300">D{day.day}</div>
                        <div>
                          <p className="text-indigo-200 font-bold text-xs md:text-sm tracking-widest print:text-slate-500 uppercase">{day.date}</p>
                          <h3 className="font-black text-white text-2xl md:text-3xl tracking-tight mt-1 print:text-slate-900">{renderText(day.theme)}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6 md:p-10 relative">
                      <div className="absolute left-[45px] sm:left-[55px] md:left-[65px] top-10 bottom-10 w-1 bg-slate-200/60 z-0 hidden md:block print:block rounded-full"></div>
                      
                      <div className="space-y-8 md:space-y-12 relative z-10">
                        {day.activities?.map((act, actIdx) => {
                          let Icon = MapPin;
                          let iconTheme = "text-indigo-600 bg-indigo-100 border-indigo-200";
                          if (act.type === 'food') { Icon = Coffee; iconTheme = "text-orange-600 bg-orange-100 border-orange-200"; }
                          if (act.type === 'transit') { Icon = Train; iconTheme = "text-slate-700 bg-slate-200 border-slate-300"; }
                          if (act.type === 'hotel') { Icon = Bed; iconTheme = "text-pink-600 bg-pink-100 border-pink-200"; }
                          if (act.type === 'freetime') { Icon = Clock; iconTheme = "text-teal-600 bg-teal-100 border-teal-200"; }

                          const isThisNodeSwapping = swappingNode === `${idx}-${actIdx}`;
                          const isMenuOpen = swapMenuOpenFor === `${idx}-${actIdx}`;
                          const isCustomInputOpen = showCustomInputFor === `${idx}-${actIdx}`;
                          const isBoundaryNode = (idx === 0 && actIdx === 0) || (idx === itinerary.dailyPlan.length - 1 && actIdx === day.activities.length - 1);
                          const isFreeTime = act.type === 'freetime';
                          
                          const hotelNameForRoute = customHotel.trim() ? customHotel.trim() : renderText(logisticsData.hotelOptions[selectedHotel]?.name);
                          const routeUrl = getRouteUrl(idx, actIdx, day.activities, hotelNameForRoute);
                          const originText = getOriginText(idx, actIdx);

                          return (
                            <div key={actIdx} className={`flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-start group relative ${isFreeTime ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}>
                              <div className="flex items-center md:flex-col md:w-28 shrink-0 gap-3 md:gap-4 pt-2">
                                <span className="font-black text-slate-800 text-lg md:text-xl tracking-tight drop-shadow-sm">{renderText(act.time)}</span>
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center shadow-md border-4 ring-4 ring-white/50 ${iconTheme}`}><Icon className="w-5 h-5 md:w-7 md:h-7" /></div>
                              </div>
                              
                              <div className={`flex-1 bg-white/95 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 print:shadow-none print:border-b-2 print:border-slate-200 print:rounded-none relative overflow-hidden print:p-4 w-full transform-gpu ${isFreeTime ? 'border-2 border-dashed border-teal-200 bg-teal-50/30' : 'border border-white'}`}>
                                
                                {routeUrl && (
                                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-b border-indigo-100/50 px-5 sm:px-6 md:px-8 py-3 flex items-center justify-between print:hidden backdrop-blur-sm rounded-t-[2rem]">
                                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-bold text-slate-600 truncate mr-2">
                                      <MapPinned className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500 shrink-0"/>
                                      <span className="truncate">{renderText(originText)}</span>
                                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 shrink-0"/>
                                      <span className="truncate">{renderText(act.location)}</span>
                                    </div>
                                    <a href={routeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold bg-indigo-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shrink-0">
                                      <Navigation className="w-3.5 h-3.5"/> <span className="hidden sm:inline">{t.routeNav}</span><span className="sm:hidden">導航</span>
                                    </a>
                                  </div>
                                )}

                                <div className={`${routeUrl ? 'pt-14 md:pt-12' : 'pt-4 md:pt-5'}`}>
                                  {isThisNodeSwapping && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[2rem]">
                                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
                                      <span className="text-indigo-800 font-bold text-lg">{t.swapping}</span>
                                    </div>
                                  )}

                                  {/* 動態時間軸引擎 (Dynamic Timeline Controls) */}
                                  <div className="mx-5 sm:mx-6 md:mx-8 mb-6 flex flex-wrap items-center gap-3 bg-slate-50/80 p-3.5 md:p-4 rounded-2xl border border-slate-200/60 print:hidden">
                                    <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
                                      <input 
                                        type="checkbox" 
                                        checked={!!act.isCompleted} 
                                        onChange={() => handleToggleComplete(idx, actIdx)} 
                                        className="w-5 h-5 accent-indigo-600 rounded border-slate-300"
                                      />
                                      <span className={`text-sm font-black transition-colors ${act.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        {t.markDone}
                                      </span>
                                    </label>

                                    {act.isCompleted && (
                                      <div className="flex flex-wrap items-center gap-3 flex-1 animate-in fade-in slide-in-from-left-2 border-l border-slate-200 pl-3 ml-1">
                                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
                                          <span className="text-xs font-bold text-slate-500">{t.actualTime}</span>
                                          <input 
                                            type="time" 
                                            value={act.actualEndTime || ''} 
                                            onChange={(e) => handleActualTimeChange(idx, actIdx, e.target.value)} 
                                            className="text-sm font-black text-indigo-700 outline-none bg-transparent cursor-pointer"
                                          />
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 ml-auto bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                                          <span className="text-[10px] md:text-xs font-black text-slate-400 px-2 tracking-widest uppercase hidden sm:block">微調</span>
                                          <button onClick={() => handleShiftFromNode(idx, actIdx, 15)} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors">+15m</button>
                                          <button onClick={() => handleShiftFromNode(idx, actIdx, 30)} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors">+30m</button>
                                          <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                                          <button onClick={() => handleShiftFromNode(idx, actIdx, -15)} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1.5 rounded-lg hover:bg-teal-100 font-bold transition-colors">-15m</button>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="px-5 sm:px-6 md:px-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                                    <h4 className={`font-black text-2xl md:text-3xl leading-tight mt-1 drop-shadow-sm transition-colors ${isFreeTime ? 'text-teal-800' : (act.isCompleted ? 'text-slate-400' : 'text-slate-800')}`}>
                                      {renderText(act.location)}
                                    </h4>
                                    
                                    {!isBoundaryNode && !act.isCompleted && (
                                      <div className="w-full md:w-auto print:hidden transition-all duration-300">
                                        {isCustomInputOpen ? (
                                          <div className="flex flex-col sm:flex-row w-full gap-2 animate-in fade-in slide-in-from-right-2 pt-1">
                                            <input 
                                              type="text" 
                                              autoFocus
                                              value={customSwapText} 
                                              onChange={(e) => setCustomSwapText(e.target.value)} 
                                              placeholder={t.customPlh} 
                                              className="flex-1 min-w-[200px] p-2.5 text-sm font-medium text-slate-800 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-0 outline-none shadow-sm transition-colors"
                                              onKeyDown={(e) => { if(e.key === 'Enter' && customSwapText.trim()) handleSwapNode(idx, actIdx, 'custom', customSwapText) }}
                                            />
                                            <div className="flex gap-2">
                                              <button 
                                                disabled={!customSwapText.trim()}
                                                onClick={() => handleSwapNode(idx, actIdx, 'custom', customSwapText)} 
                                                className="flex-1 sm:flex-none bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                                              >
                                                {t.btnConfirm}
                                              </button>
                                              <button 
                                                onClick={() => { setShowCustomInputFor(null); setCustomSwapText(''); }} 
                                                className="flex-1 sm:flex-none bg-white text-slate-500 border-2 border-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                                              >
                                                {t.btnCancel}
                                              </button>
                                            </div>
                                          </div>
                                        ) : isMenuOpen ? (
                                          <div className="flex flex-wrap items-center gap-2 bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100 shadow-inner w-full md:w-[380px] animate-in fade-in slide-in-from-top-2">
                                            <div className="w-full flex justify-between items-center mb-1">
                                              <span className="text-xs font-black text-indigo-800 uppercase tracking-wider">{t.swapPrompt}</span>
                                              <button onClick={() => setSwapMenuOpenFor(null)} className="text-indigo-300 hover:text-indigo-600 bg-white rounded-full p-1 shadow-sm"><X className="w-3 h-3"/></button>
                                            </div>
                                            <button onClick={() => handleSwapNode(idx, actIdx, 'indoor')} className="flex-1 min-w-[110px] text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 px-3 py-2 rounded-xl transition-colors shadow-sm">☂️ {t.swapOpts.indoor}</button>
                                            <button onClick={() => handleSwapNode(idx, actIdx, 'relax')} className="flex-1 min-w-[110px] text-xs font-bold text-teal-700 bg-white hover:bg-teal-600 hover:text-white border border-teal-200 px-3 py-2 rounded-xl transition-colors shadow-sm">☕ {t.swapOpts.relax}</button>
                                            <button onClick={() => handleSwapNode(idx, actIdx, 'food')} className="flex-1 min-w-[110px] text-xs font-bold text-orange-700 bg-white hover:bg-orange-500 hover:text-white border border-orange-200 px-3 py-2 rounded-xl transition-colors shadow-sm">🍔 {t.swapOpts.food}</button>
                                            <button onClick={() => handleSwapNode(idx, actIdx, 'any')} className="flex-1 min-w-[110px] text-xs font-bold text-purple-700 bg-white hover:bg-purple-600 hover:text-white border border-purple-200 px-3 py-2 rounded-xl transition-colors shadow-sm">✨ {t.swapOpts.any}</button>
                                            <button onClick={() => setShowCustomInputFor(`${idx}-${actIdx}`)} className="flex-1 min-w-[110px] text-xs font-bold text-blue-700 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 px-3 py-2 rounded-xl transition-colors shadow-sm">{t.swapOpts.custom}</button>
                                          </div>
                                        ) : (
                                          <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-end">
                                            <button onClick={() => setSwapMenuOpenFor(`${idx}-${actIdx}`)} className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-3 md:px-4 py-2 rounded-xl transition-colors shadow-sm">
                                              <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" /> {t.swapNode}
                                            </button>
                                            
                                            {!isFreeTime && (
                                              <button 
                                                onClick={() => handleDeleteNode(idx, actIdx)} 
                                                className={`flex items-center gap-1.5 text-xs md:text-sm font-bold px-3 md:px-4 py-2 rounded-xl transition-all shadow-sm ${deletingNode === `${idx}-${actIdx}` ? 'bg-red-600 text-white animate-pulse' : 'text-red-700 bg-red-100 hover:bg-red-200'}`}
                                              >
                                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                                                {deletingNode === `${idx}-${actIdx}` ? t.confirmDelete : t.deleteNode}
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {act.costEstimate && !isFreeTime && (
                                    <span className={`inline-flex items-center gap-1.5 md:gap-2 text-slate-800 font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm whitespace-nowrap mb-4 md:mb-5 print:bg-transparent print:border print:border-slate-200 shadow-sm border border-slate-200/50 mx-5 sm:mx-6 md:mx-8 ${act.isCompleted ? 'bg-slate-50 opacity-50' : 'bg-slate-100'}`}>
                                      <Wallet className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500"/> 
                                      {renderText(act.costEstimate)}
                                    </span>
                                  )}

                                  {/* 🚀 手術部位：營業時間防呆與免責標籤 */}
                                  {act.operatingHours && !isFreeTime && (
                                    <div className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold text-slate-600 mb-4 md:mb-5 bg-white inline-flex px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-slate-200 print:bg-transparent print:border print:border-slate-200 shadow-sm ${act.isCompleted ? 'opacity-50' : ''} ml-5 sm:ml-9 md:ml-11`}>
                                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" /> 
                                      <span>{renderText(act.operatingHours)} <span className="text-[10px] md:text-xs text-slate-400 font-medium ml-1 tracking-wide">{t.estTime}</span></span>
                                    </div>
                                  )}

                                  {checkTimeConflict(act) && !isFreeTime && (
                                    <div className="mx-5 sm:mx-6 md:mx-8 mb-5 mt-[-10px] bg-red-50 border border-red-200 p-3.5 md:p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in zoom-in print:hidden">
                                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                      <div className="text-sm md:text-base font-black text-red-700 leading-snug">
                                        注意：抵達時間 ({renderText(act.time)}) 距離打烊時間過近，或已超過營業時間。<br/>
                                        <span className="text-xs md:text-sm font-bold text-red-600/80 mt-1 block">建議點擊「換一個」或「刪除」來調整行程。</span>
                                      </div>
                                    </div>
                                  )}

                                  <div className={`${isFreeTime ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-200/60'} p-5 sm:p-6 md:p-8 rounded-3xl border mb-6 print:bg-transparent print:border-none print:p-0 print:mb-4 shadow-sm mx-5 sm:mx-6 md:mx-8 ${act.isCompleted ? 'opacity-60' : ''}`}>
                                    {!isFreeTime && (
                                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                                        {act.type === 'transit' ? <Car className="w-4 h-4 md:w-5 md:h-5 text-slate-500"/> : <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-orange-500"/>}
                                        <strong className="text-slate-800 text-base md:text-lg">{t.actionGuide}</strong>
                                      </div>
                                    )}
                                    <p className={`${isFreeTime ? 'text-teal-700' : 'text-slate-700'} leading-relaxed text-sm md:text-lg font-medium whitespace-pre-wrap`}>
                                      {renderText(act.detailedInstruction)}
                                    </p>
                                  </div>

                                  {act.expertReason && !isFreeTime && (
                                    <div className={`bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-5 sm:p-6 md:p-8 rounded-3xl mb-6 print:bg-indigo-50/30 print:border-none print:p-4 shadow-sm mx-5 sm:mx-6 md:mx-8 ${act.isCompleted ? 'opacity-60 grayscale-[50%]' : ''}`}>
                                      <div className="flex gap-3 md:gap-4 text-indigo-900">
                                        <Sparkles className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-indigo-600 mt-1" />
                                        <div>
                                          <strong className="block text-base md:text-lg font-black text-indigo-900 mb-2 tracking-wide">{t.expertReason}</strong>
                                          <p className="text-sm md:text-lg font-medium leading-relaxed text-indigo-800/90 whitespace-pre-wrap">
                                            {renderText(act.expertReason)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {!isFreeTime && (
                                    <div className={`flex flex-wrap gap-3 md:gap-4 print:hidden pt-2 mx-5 sm:mx-6 md:mx-8 pb-4 sm:pb-5 md:pb-6 ${act.isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
                                      {act.officialLink && (
                                        <a href={act.officialLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 bg-slate-900 hover:bg-black text-white text-xs md:text-sm font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-md transition-colors border border-slate-700">
                                          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4"/> {t.officialLink}
                                        </a>
                                      )}

                                      {act.ticketRequired && (
                                        <>
                                          <a href={getKlookUrl(act.ticketSearchKeyword || renderText(act.location))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 bg-[#ff5a5f] hover:bg-[#ff3b40] text-white text-xs md:text-sm font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-md transition-colors border border-[#ff3b40]">
                                            <Ticket className="w-3.5 h-3.5 md:w-4 md:h-4"/> Klook {lang === 'zh-TW' ? '找票' : (lang === 'ja' ? 'チケット検索' : 'Tickets')}
                                          </a>
                                          <a href={getKkdayUrl(act.ticketSearchKeyword || renderText(act.location))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 bg-[#00a2e8] hover:bg-[#0089c4] text-white text-xs md:text-sm font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-md transition-colors border border-[#0089c4]">
                                            <Ticket className="w-3.5 h-3.5 md:w-4 md:h-4"/> KKday {lang === 'zh-TW' ? '找票' : (lang === 'ja' ? 'チケット検索' : 'Tickets')}
                                          </a>
                                        </>
                                      )}
                                      
                                      {act.type !== 'transit' && (
                                        <>
                                          <a href={getGoogleMapsUrl(renderText(act.location), formData.destCity)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 text-xs md:text-sm font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-colors shadow-sm">
                                            <Map className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600"/> {t.mapNav}
                                          </a>
                                          <a href={getGoogleImagesUrl(renderText(act.location), formData.destCity)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 text-xs md:text-sm font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-colors shadow-sm">
                                            <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600"/> {t.photo}
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

      <footer className="relative z-10 py-8 text-center text-white/70 text-xs font-bold tracking-widest print:hidden">
        © 2026 | ITINERARY MASTER | VERSION {APP_VERSION.split(' - ')[0]}
      </footer>
    </div>
  );
}