export const FOCUSED_CITIES = [
  "Milwaukee WI",
  "Chicago IL",
  "Atlanta GA",
   "St.Paul MN",
     "Jilin China",
  "Shenyang China",
  "Changchun China",
  "Los Angeles CA",
  "Dublin Ireland",


  "San Jose CA",
  "Davis CA",
  "Miami FL",
  "San Diego CA",
  "Loma Linda CA",
  "Honolulu HI",
];

export const OTHER_CITIES = [
  "New York NY",
  
  "London UK",
  "Tokyo Japan",
  "Paris France",
  "Sydney Australia",
    "São Paulo Brazil",
  "Hamilton Bermuda",
  "Brasilia Brazil",
  "Dubai",
  "Singapore",
  "Mumbai India",
  "Toronto Canada",
  "Berlin Germany",
  "Rome Italy",

  "Beijing China",
  "Shanghai China",
  "Guangzhou China",
  "Chongqing China",
  "Kunming China",
  "Hainan China",
  "Taipei Taiwan",

  // USA
  "Minneapolis MN",
  "Sarasota FL",
  "Orlando FL",
  "Las Vegas NV",
  "Tucson AZ",
  "Houston TX",
  "Dallas TX",
  "Charlotte NC",
  "Washington DC",
  "Seattle WA",

  // International
  "Vancouver Canada",
  "San Jose Costa Rica",
  "Wellington New Zealand",
  "Bahamas",
  "Cayman Islands",
];

export const ALL_CITIES = [...FOCUSED_CITIES, ...OTHER_CITIES];

export const cityChinese: Record<string, string> = {
  "Milwaukee": "密尔沃基",
  "Dublin": "都柏林",
  "São Paulo": "圣保罗",
  "Sao Paulo": "圣保罗",
  "Brasilia": "巴西利亚",
  "Chicago": "芝加哥",
  "Atlanta": "亚特兰大",
  "St. Paul": "圣保罗",
  "St Paul": "圣保罗",
  "Saint Paul": "圣保罗",
  "St.Paul": "圣保罗",
  "Miami": "迈阿密",
  "San Diego": "圣地亚哥",
  "Loma Linda": "洛马林达",
  "San Jose": "圣何塞",
  "Davis": "戴维斯",
  "Hamilton": "汉密尔顿",
  "New York": "纽约",
  "Los Angeles": "洛杉矶",
  "London": "伦敦",
  "Tokyo": "东京",
  "Paris": "巴黎",
  "Sydney": "悉尼",
  "Dubai": "迪拜",
  "Singapore": "新加坡",
  "Mumbai": "孟买",
  "Toronto": "多伦多",
  "Berlin": "柏林",
  "Rome": "罗马",
  "Jilin": "吉林",
  "Shenyang": "沈阳",
  "Changchun": "长春",
  "Beijing": "北京",
  "Shanghai": "上海",
  "Guangzhou": "广州",
  "Chongqing": "重庆",
  "Kunming": "昆明",
  "Hainan": "海南",
  "Taipei": "台北",

  // Additions (countries removed)
  "Minneapolis": "明尼阿波利斯",
  "Sarasota": "萨拉索塔",
  "Orlando": "奥兰多",
  "Las Vegas": "拉斯维加斯",
  "Tucson": "图森",
  "Houston": "休斯顿",
  "Dallas": "达拉斯",
  "Charlotte": "夏洛特",
  "Washington": "华盛顿哥伦比亚特区",
  "Seattle": "西雅图",
  "Vancouver": "温哥华",
  "Wellington": "惠灵顿",
  "Nassau": "拿骚",
  "George Town": "乔治敦",
  "Honolulu": "檀香山",

};

export const getCityChinese = (englishName: string): string => {
  return cityChinese[englishName] || "";
};

export interface CityMetadata {
  languages: string;
  characteristics: string;
}

export const CITY_METADATA: Record<string, CityMetadata> = {
  "Milwaukee WI": {
    languages: "English / 英语",
    characteristics: "Beer brewing heritage, Harley-Davidson, Lake Michigan / 啤酒酿造传统、哈雷戴维森、密歇根湖"
  },
  "Dublin Ireland": {
    languages: "English, Irish / 英语、爱尔兰语",
    characteristics: "Pubs, historic castles, literary history / 酒馆、历史城堡、文学历史"
  },
  "São Paulo Brazil": {
    languages: "Portuguese / 葡萄牙语",
    characteristics: "Gastronomy, financial hub, massive skyscrapers / 美食、金融中心、摩天大楼群"
  },
  "Hamilton Bermuda": {
    languages: "English / 英语",
    characteristics: "Historic harbor town, pastel houses, coral gardens, pink sand beaches / 历史港口小镇、彩色房屋、珊瑚花园、粉红沙滩"
  },
  "Brasilia Brazil": {
    languages: "Portuguese / 葡萄牙语",
    characteristics: "Modernist architecture, planned city layout, capital city / 现代主义建筑、规划城市布局、首都"
  },
  "Chicago IL": {
    languages: "English / 英语",
    characteristics: "Deep-dish pizza, modern architecture, jazz heritage / 深盘披萨、现代建筑、爵士乐遗产"
  },
  "Atlanta GA": {
    languages: "English / 英语",
    characteristics: "Civil rights history, Coca-Cola, world's busiest airport / 民权历史、可口可乐、世界上最繁忙的机场"
  },
  "St.Paul MN": {
    languages: "English / 英语",
    characteristics: "Victorian architecture, winter carnival, Mississippi riverfront / 维多利亚式建筑、冬季狂欢节、密西西比河畔"
  },
  "San Jose CA": {
    languages: "English, Spanish, Vietnamese / 英语、西班牙语、越南语",
    characteristics: "Silicon Valley, tech hub, Winchester Mystery House / 硅谷、科技中心、温彻斯特神秘屋"
  },
  "Davis CA": {
    languages: "English / 英语",
    characteristics: "Bicycles, university town, agricultural research / 自行车之城、大学城、农业研究"
  },
  "Miami FL": {
    languages: "English, Spanish / 英语、西班牙语",
    characteristics: "Beaches, nightlife, Art Deco historic district / 沙滩、夜生活、装饰艺术历史街区"
  },
  "San Diego CA": {
    languages: "English, Spanish / 英语、西班牙语",
    characteristics: "San Diego Zoo, pleasant climate, surfing beaches / 圣地亚哥动物园、宜人气候、冲浪沙滩"
  },
  "Loma Linda CA": {
    languages: "English / 英语",
    characteristics: "Blue Zone longevity, health-conscious lifestyle, medical center / 蓝色地带长寿之乡、健康生活方式、医疗中心"
  },
  "Honolulu HI": {
    languages: "English, Hawaiian / 英语、夏威夷语",
    characteristics: "Waikiki Beach, Pearl Harbor, tropical climate / 威基基海滩、珍珠港、热带气候"
  },
  "New York NY": {
    languages: "English / 英语",
    characteristics: "Broadway, Times Square, Statue of Liberty / 百老汇、时代广场、自由女神像"
  },
  "Los Angeles CA": {
    languages: "English, Spanish / 英语、西班牙语",
    characteristics: "Hollywood, movies, and beaches / 好莱坞、电影与沙滩"
  },
  "London UK": {
    languages: "English / 英语",
    characteristics: "Big Ben, royal palaces, historic museums / 大本钟、皇家宫殿、历史博物馆"
  },
  "Tokyo Japan": {
    languages: "Japanese / 日语",
    characteristics: "Sushi, anime, bustling crossings, neon lights / 寿司、动漫、繁忙十字路口、霓虹灯光"
  },
  "Paris France": {
    languages: "French / 法语",
    characteristics: "Eiffel Tower, art museums, fashion, cafes / 埃菲尔铁塔、艺术博物馆、时尚与咖啡馆"
  },
  "Sydney Australia": {
    languages: "English / 英语",
    characteristics: "Opera House, Harbour Bridge, Bondi Beach / 歌剧院、港湾大桥、邦迪海滩"
  },
  "Dubai": {
    languages: "Arabic, English / 阿拉伯语、英语",
    characteristics: "Burj Khalifa, luxury shopping, desert safaris / 哈利法塔、奢侈品购物、沙漠越野旅行"
  },
  "Singapore": {
    languages: "English, Malay, Mandarin, Tamil / 英语、马来语、华语、泰米尔语",
    characteristics: "Marina Bay Sands, clean streets, garden city / 滨海湾金沙、整洁街道、花园城市"
  },
  "Mumbai India": {
    languages: "Hindi, Marathi, English / 印地语、马拉地语、英语",
    characteristics: "Bollywood, Gateway of India, bustling markets / 宝莱坞、印度门、繁华市集"
  },
  "Toronto Canada": {
    languages: "English, French / 英语、法语",
    characteristics: "CN Tower, diverse neighborhoods, film festival / 加拿大国家电视塔、多元社区、电影节"
  },
  "Berlin Germany": {
    languages: "German / 德语",
    characteristics: "Berlin Wall, club culture, Brandenburg Gate / 柏林墙、夜店文化、勃兰登堡门"
  },
  "Rome Italy": {
    languages: "Italian / 意大利语",
    characteristics: "Colosseum, Vatican City, ancient history, pasta / 罗马斗兽场、梵蒂冈城、古老历史、意式面食"
  },
  "Jilin China": {
    languages: "Mandarin / 普通话",
    characteristics: "Rime ice, Songhua River, ski resorts / 雾凇奇观、松花江畔、滑雪胜地"
  },
  "Shenyang China": {
    languages: "Mandarin / 普通话",
    characteristics: "Mukden Palace, industrial history, historical sites / 沈阳故宫、工业历史、历史遗迹"
  },
  "Changchun China": {
    languages: "Mandarin / 普通话",
    characteristics: "Automobile industry, Puppet Emperor's Palace, film studio / 汽车工业、伪满皇宫、长影制片厂"
  },
  "Beijing China": {
    languages: "Mandarin / 普通话",
    characteristics: "Great Wall, Forbidden City, Peking duck / 万里长城、故宫、北京烤鸭"
  },
  "Shanghai China": {
    languages: "Mandarin / 普通话",
    characteristics: "The Bund, Oriental Pearl Tower, financial center / 外滩、东方明珠、金融中心"
  },
  "Guangzhou China": {
    languages: "Cantonese, Mandarin / 粤语、普通话",
    characteristics: "Canton Tower, dim sum, global trade hub / 广州塔、广式点心、全球贸易中心"
  },
  "Chongqing China": {
    languages: "Mandarin / 普通话",
    characteristics: "Hotpot, mountainous terrain, monorails through buildings / 麻辣火锅、山城地貌、轻轨穿楼"
  },
  "Kunming China": {
    languages: "Mandarin / 普通话",
    characteristics: "Spring City, Stone Forest, beautiful flowers / 春城、石林、鲜花盛开"
  },
  "Hainan China": {
    languages: "Mandarin / 普通话",
    characteristics: "Tropical beaches, resorts, duty-free shopping / 热带沙滩、度假胜地、免税购物"
  },
  "Taipei Taiwan": {
    languages: "Mandarin / 普通话",
    characteristics: "Taipei 101, night markets, bubble tea / 台北101、夜市、珍珠奶茶"
  },
  "Minneapolis MN": {
    languages: "English / 英语",
    characteristics: "Mall of America, lakes, stone arch bridge / 美国商城、湖泊群、石拱桥"
  },
  "Sarasota FL": {
    languages: "English / 英语",
    characteristics: "Ringling Museum, white sand beaches, cultural arts / 林林博物馆、白沙滩、文化艺术"
  },
  "Orlando FL": {
    languages: "English / 英语",
    characteristics: "Theme parks, Walt Disney World, Universal Studios / 主题乐园、迪士尼世界、环球影城"
  },
  "Las Vegas NV": {
    languages: "English / 英语",
    characteristics: "Casinos, neon strip, nightlife, entertainment / 赌场、霓虹大道、丰富夜生活、娱乐之都"
  },
  "Tucson AZ": {
    languages: "English, Spanish / 英语、西班牙语",
    characteristics: "Saguaro National Park, desert scenery, astronomy / 仙人掌国家公园、沙漠景观、天文观测"
  },
  "Houston TX": {
    languages: "English, Spanish / 英语、西班牙语",
    characteristics: "Space Center, diverse food scene, energy industry / 航天中心、多元美食、能源工业"
  },
  "Dallas TX": {
    languages: "English, Spanish / 英语、西班牙语",
    characteristics: "Cowboys football, arts district, Dealey Plaza / 牛仔橄榄球、艺术区、迪利广场"
  },
  "Charlotte NC": {
    languages: "English / 英语",
    characteristics: "NASCAR Hall of Fame, banking hub, clean uptown / 纳斯卡名人堂、银行枢纽、整洁市区"
  },
  "Washington DC": {
    languages: "English / 英语",
    characteristics: "White House, Smithsonian museums, national monuments / 白宫、史密森尼博物馆群、国家纪念碑"
  },
  "Seattle WA": {
    languages: "English / 英语",
    characteristics: "Space Needle, coffee culture, Pike Place Market / 太空针塔、咖啡文化、派克市场"
  },
  "Vancouver Canada": {
    languages: "English / 英语",
    characteristics: "Mountains, Stanley Park, sea-to-sky views / 山脉、斯坦利公园、山海美景"
  },
  "San Jose Costa Rica": {
    languages: "Spanish / 西班牙语",
    characteristics: "Coffee exports, national theater, volcanic day trips / 咖啡出口、国家剧院、火山一日游"
  },
  "Wellington New Zealand": {
    languages: "English, Maori / 英语、毛利语",
    characteristics: "Windy city, film production, national museum / 风之城、电影制作、国家博物馆"
  },
  "Bahamas": {
    languages: "English / 英语",
    characteristics: "Crystal-clear waters, swimming pigs, resort islands / 清澈水域、游泳猪、度假群岛"
  },
  "Cayman Islands": {
    languages: "English / 英语",
    characteristics: "Seven Mile Beach, scuba diving, stingray city / 七哩滩、水肺潜水、黄貂鱼城"
  }
};

export const getCityMetadata = (queryCity: string): CityMetadata => {
  return CITY_METADATA[queryCity] || { languages: "Unknown", characteristics: "N/A" };
};
