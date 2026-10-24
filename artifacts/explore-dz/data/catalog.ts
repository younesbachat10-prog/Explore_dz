export type PlaceKind = 'nature' | 'history' | 'culture' | 'hidden' | 'food';

export interface Wilaya {
  code: string;
  id: string;
  name: string;
  latin: string;
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  imageQuery: string;
  kind: PlaceKind;
  wilayaId: string;
  wilayaName: string;
  latitude: number;
  longitude: number;
  summary: string;
}

type AttractionSeed = [name: string, imageQuery: string, kind: Exclude<PlaceKind, 'food'>];

type WilayaSeed = [
  code: string,
  name: string,
  latin: string,
  latitude: number,
  longitude: number,
  attractions: [AttractionSeed, AttractionSeed, AttractionSeed],
];

const seeds: WilayaSeed[] = [
  ['01', 'أدرار', 'Adrar', 27.87, -0.29, [
    ['قصور توات', 'Ksour of Touat Algeria', 'history'],
    ['واحات أدرار', 'Adrar oasis Algeria', 'nature'],
    ['قصر تمنطيط', 'Temacine? Tamantit ksar Adrar', 'culture'],
  ]],
  ['02', 'الشلف', 'Chlef', 36.17, 1.33, [
    ['المدينة القديمة في تنس', 'Ténès old town Algeria', 'history'],
    ['رأس إيفي', 'Cap Ivi Algeria', 'nature'],
    ['ساحل بني حواء', 'Beni Haoua beach Algeria', 'nature'],
  ]],
  ['03', 'الأغواط', 'Laghouat', 33.80, 2.88, [
    ['المدينة القديمة بالأغواط', 'Laghouat old town Algeria', 'history'],
    ['جبال العمور', 'Djebel Amour Algeria', 'nature'],
    ['أفلو', 'Aflou Algeria', 'culture'],
  ]],
  ['04', 'أم البواقي', 'Oum El Bouaghi', 35.88, 7.11, [
    ['عين البيضاء', 'Ain Beida Algeria', 'culture'],
    ['عين مليلة', 'Ain M lila Algeria', 'culture'],
    ['حمام سيدي يحيى', 'Hammam Sidi Yahia Algeria', 'nature'],
  ]],
  ['05', 'باتنة', 'Batna', 35.56, 6.17, [
    ['مدينة تيمقاد الأثرية', 'Timgad Algeria Roman ruins', 'history'],
    ['شرفات غوفي', 'Ghoufi Balconies Algeria', 'nature'],
    ['الحظيرة الوطنية بلزمة', 'Belezma National Park Algeria', 'nature'],
  ]],
  ['06', 'بجاية', 'Béjaïa', 36.75, 5.06, [
    ['رأس كاربون', 'Cap Carbon Bejaia Algeria', 'nature'],
    ['الحظيرة الوطنية قورايا', 'Gouraya National Park Algeria', 'nature'],
    ['قمة يما قورايا', 'Yemma Gouraya Algeria', 'history'],
  ]],
  ['07', 'بسكرة', 'Biskra', 34.85, 5.73, [
    ['مسجد سيدي عقبة', 'Sidi Okba Mosque Algeria', 'history'],
    ['واحات طولقة', 'Tolga palm groves Algeria', 'nature'],
    ['نخيل بسكرة', 'Biskra oasis Algeria', 'culture'],
  ]],
  ['08', 'بشار', 'Béchar', 31.62, -2.22, [
    ['قصر تاغيت', 'Taghit ksar Algeria', 'history'],
    ['واحة تاغيت', 'Taghit oasis Algeria', 'nature'],
    ['بني عباس', 'Beni Abbes Algeria', 'culture'],
  ]],
  ['09', 'البليدة', 'Blida', 36.47, 2.83, [
    ['الحظيرة الوطنية الشريعة', 'Chréa National Park Algeria', 'nature'],
    ['حمام ملوان', 'Hammam Melouane Algeria', 'nature'],
    ['المدينة القديمة بالبليدة', 'Blida old town Algeria', 'culture'],
  ]],
  ['10', 'البويرة', 'Bouira', 36.37, 3.90, [
    ['تيكجدة', 'Tikjda Algeria', 'nature'],
    ['الحظيرة الوطنية جرجرة', 'Djurdjura National Park Algeria', 'nature'],
    ['بحيرة غولميم', 'Lake Goulmim Algeria', 'nature'],
  ]],
  ['11', 'تمنراست', 'Tamanrasset', 22.79, 5.52, [
    ['الأهقار', 'Ahaggar National Park Algeria', 'nature'],
    ['قمة أسكرام', 'Assekrem Algeria', 'nature'],
    ['مدينة تمنراست القديمة', 'Tamanrasset Algeria', 'culture'],
  ]],
  ['12', 'تبسة', 'Tébessa', 35.40, 8.12, [
    ['الأسوار الرومانية بتبسة', 'Tebessa Roman walls Algeria', 'history'],
    ['قوس كركلا', 'Caracalla Arch Tebessa Algeria', 'history'],
    ['معبد مينرفا', 'Temple of Minerva Tebessa Algeria', 'history'],
  ]],
  ['13', 'تلمسان', 'Tlemcen', 34.88, -1.32, [
    ['منصورة تلمسان', 'Mansourah Tlemcen Algeria', 'history'],
    ['الجامع الكبير بتلمسان', 'Great Mosque of Tlemcen Algeria', 'history'],
    ['مسجد سيدي بومدين', 'Sidi Boumediene Mosque Tlemcen', 'history'],
  ]],
  ['14', 'تيارت', 'Tiaret', 35.37, 1.32, [
    ['فرندة', 'Frenda Algeria', 'culture'],
    ['نقوش فرندة الصخرية', 'Frenda rock art Algeria', 'history'],
    ['جبال تيارت', 'Tiaret mountains Algeria', 'nature'],
  ]],
  ['15', 'تيزي وزو', 'Tizi Ouzou', 36.72, 4.05, [
    ['الحظيرة الوطنية جرجرة', 'Djurdjura National Park Algeria', 'nature'],
    ['غابات ياكورن', 'Yakouren forest Algeria', 'nature'],
    ['ساحل أزفون', 'Azeffoun Algeria coast', 'nature'],
  ]],
  ['16', 'الجزائر العاصمة', 'Algiers', 36.75, 3.06, [
    ['قصبة الجزائر', 'Casbah of Algiers Algeria', 'history'],
    ['حديقة التجارب الحامة', 'Jardin d Essai Algiers Algeria', 'nature'],
    ['مقام الشهيد', 'Martyrs Memorial Algiers Algeria', 'history'],
  ]],
  ['17', 'الجلفة', 'Djelfa', 34.67, 3.25, [
    ['النقوش الصخرية بالجلفة', 'Djelfa rock art Algeria', 'history'],
    ['غابة السنّالب', 'Senalba forest Algeria', 'nature'],
    ['محمية المِرڨب', 'Mergueb nature reserve Algeria', 'nature'],
  ]],
  ['18', 'جيجل', 'Jijel', 36.82, 5.77, [
    ['الحظيرة الوطنية تازة', 'Taza National Park Algeria', 'nature'],
    ['مغارة غار الباز', 'Ghar el Baz Jijel Algeria', 'nature'],
    ['ساحل العوانة', 'El Aouana Algeria coast', 'nature'],
  ]],
  ['19', 'سطيف', 'Sétif', 36.19, 5.41, [
    ['جميلة الأثرية', 'Djemila Algeria Roman ruins', 'history'],
    ['عين الفوارة', 'Ain El Fouara Setif Algeria', 'culture'],
    ['المتحف الوطني بسطيف', 'Setif National Museum Algeria', 'history'],
  ]],
  ['20', 'سعيدة', 'Saïda', 34.83, 0.15, [
    ['حمام ربي', 'Hammam Rabbi Saida Algeria', 'nature'],
    ['غابات سعيدة', 'Saida forest Algeria', 'nature'],
    ['تيفريت', 'Tiffrit Saida Algeria', 'culture'],
  ]],
  ['21', 'سكيكدة', 'Skikda', 36.88, 6.91, [
    ['المسرح الروماني بسكيكدة', 'Skikda Roman theatre Algeria', 'history'],
    ['ميناء ستورا', 'Stora Skikda Algeria', 'culture'],
    ['شواطئ فلفلة', 'Filfila beach Skikda Algeria', 'nature'],
  ]],
  ['22', 'سيدي بلعباس', 'Sidi Bel Abbès', 35.19, -0.63, [
    ['جبال تسالة', 'Tessala mountains Algeria', 'nature'],
    ['وسط مدينة سيدي بلعباس', 'Sidi Bel Abbes city Algeria', 'culture'],
    ['غابات تلاغ', 'Telagh forest Algeria', 'nature'],
  ]],
  ['23', 'عنابة', 'Annaba', 36.90, 7.77, [
    ['هيبون الأثرية', 'Hippo Regius Annaba Algeria', 'history'],
    ['بازيليك القديس أوغسطين', 'Basilica of Saint Augustine Annaba', 'history'],
    ['رأس الحراسة', 'Cap de Garde Annaba Algeria', 'nature'],
  ]],
  ['24', 'قالمة', 'Guelma', 36.46, 7.43, [
    ['حمام دباغ', 'Hammam Debagh Guelma Algeria', 'nature'],
    ['المسرح الروماني بقالمة', 'Guelma Roman theatre Algeria', 'history'],
    ['دولمانات الركنية', 'Roknia dolmens Algeria', 'history'],
  ]],
  ['25', 'قسنطينة', 'Constantine', 36.37, 6.61, [
    ['جسور قسنطينة', 'Constantine bridges Algeria', 'culture'],
    ['قصر أحمد باي', 'Ahmed Bey Palace Constantine Algeria', 'history'],
    ['مدينة تيديس الأثرية', 'Tiddis archaeological site Algeria', 'history'],
  ]],
  ['26', 'المدية', 'Médéa', 36.26, 2.75, [
    ['المدينة القديمة بالمدية', 'Medea old town Algeria', 'history'],
    ['جبال تامسقيدة', 'Tamesguida Medea Algeria', 'nature'],
    ['غابات المدية', 'Medea forest Algeria', 'nature'],
  ]],
  ['27', 'مستغانم', 'Mostaganem', 35.93, 0.09, [
    ['حي طبانة التاريخي', 'Tigditt Mostaganem Algeria', 'history'],
    ['شاطئ صلامندر', 'Salamandre Mostaganem Algeria', 'nature'],
    ['شواطئ صابلات', 'Sablettes Mostaganem Algeria', 'nature'],
  ]],
  ['28', 'المسيلة', 'M’Sila', 35.71, 4.54, [
    ['قلعة بني حماد', 'Beni Hammad Fort Algeria', 'history'],
    ['مدينة بوسعادة', 'Bou Saada Algeria', 'culture'],
    ['جبال المعاضيد', 'Maadid mountains Algeria', 'nature'],
  ]],
  ['29', 'معسكر', 'Mascara', 35.40, 0.14, [
    ['ينابيع بوحنيفية', 'Bou Hanifia hot springs Algeria', 'nature'],
    ['موقع تغنيف الأثري', 'Tighennif archaeological site Algeria', 'history'],
    ['مدينة معسكر القديمة', 'Mascara old town Algeria', 'culture'],
  ]],
  ['30', 'ورقلة', 'Ouargla', 31.95, 5.32, [
    ['قصر ورقلة القديم', 'Ksar Ouargla Algeria', 'history'],
    ['واحات سيدي خويلد', 'Sidi Khouiled Ouargla Algeria', 'nature'],
    ['نخيل حاسي بن عبد الله', 'Hassi Ben Abdellah Algeria palms', 'culture'],
  ]],
  ['31', 'وهران', 'Oran', 35.70, -0.64, [
    ['حصن سانتا كروز', 'Fort Santa Cruz Oran Algeria', 'history'],
    ['قصر الباي بوهران', 'Bey Palace Oran Algeria', 'history'],
    ['حي سيدي الهواري', 'Sidi El Houari Oran Algeria', 'culture'],
  ]],
  ['32', 'البيض', 'El Bayadh', 33.68, 1.02, [
    ['واحة بريزينة', 'Brezina oasis Algeria', 'nature'],
    ['النقوش الصخرية بالأبيض', 'El Bayadh rock art Algeria', 'history'],
    ['جبال القصور', 'Ksour Mountains Algeria', 'nature'],
  ]],
  ['33', 'إليزي', 'Illizi', 26.48, 8.47, [
    ['تاسيلي ناجر', 'Tassili n Ajjer Algeria', 'history'],
    ['واحة إهرير', 'Iherir oasis Algeria', 'nature'],
    ['إن أمناس', 'In Amenas Algeria', 'culture'],
  ]],
  ['34', 'برج بوعريريج', 'Bordj Bou Arréridj', 36.07, 4.76, [
    ['مضايق البيبان', 'Bibans gorges Algeria', 'nature'],
    ['قلعة المقراني', 'Bordj Bou Arreridj Algeria citadel', 'history'],
    ['جبال برج بوعريريج', 'Bordj Bou Arreridj mountains', 'nature'],
  ]],
  ['35', 'بومرداس', 'Boumerdès', 36.76, 3.47, [
    ['مدينة دلس القديمة', 'Dellys old town Algeria', 'history'],
    ['رأس جنات', 'Cap Djinet Algeria', 'nature'],
    ['شواطئ زموري', 'Zemmouri beach Algeria', 'nature'],
  ]],
  ['36', 'الطارف', 'El Tarf', 36.77, 8.31, [
    ['الحظيرة الوطنية القالة', 'El Kala National Park Algeria', 'nature'],
    ['بحيرة طونغا', 'Lake Tonga Algeria', 'nature'],
    ['بحيرة أوبيرا', 'Lake Oubeira Algeria', 'nature'],
  ]],
  ['37', 'تندوف', 'Tindouf', 27.67, -8.15, [
    ['قصر تندوف القديم', 'Tindouf old ksar Algeria', 'history'],
    ['هضاب تندوف الصحراوية', 'Tindouf desert plateau Algeria', 'nature'],
    ['منطقة قارة جبيلات', 'Gara Djebilet Algeria', 'culture'],
  ]],
  ['38', 'تيسمسيلت', 'Tissemsilt', 35.61, 1.81, [
    ['الحظيرة الوطنية ثنية الحد', 'Theniet El Had National Park Algeria', 'nature'],
    ['غابة المداد', 'El Meddad forest Algeria', 'nature'],
    ['غابات تيسمسيلت', 'Tissemsilt forests Algeria', 'nature'],
  ]],
  ['39', 'الوادي', 'El Oued', 33.37, 6.87, [
    ['مدينة الألف قبة', 'El Oued Algeria domed architecture', 'culture'],
    ['قصر قمار', 'Guemar Algeria', 'history'],
    ['كثبان وادي سوف', 'El Oued Souf dunes Algeria', 'nature'],
  ]],
  ['40', 'خنشلة', 'Khenchela', 35.44, 7.14, [
    ['حمام الصالحين', 'Hammam Essalihine Algeria', 'history'],
    ['قمة شيليا', 'Mount Chelia Algeria', 'nature'],
    ['الحمامات الرومانية بخنشلة', 'Khenchela Roman baths Algeria', 'history'],
  ]],
  ['41', 'سوق أهراس', 'Souk Ahras', 36.29, 7.95, [
    ['مدينة مادور الأثرية', 'Madaure M Dourouch Algeria', 'history'],
    ['ثاغاست', 'Thagaste Souk Ahras Algeria', 'history'],
    ['مدينة خميسة الأثرية', 'Khemissa Algeria Roman ruins', 'history'],
  ]],
  ['42', 'تيبازة', 'Tipaza', 36.59, 2.45, [
    ['المدينة الرومانية بتيبازة', 'Tipasa Roman ruins Algeria', 'history'],
    ['جبل شنوة', 'Mount Chenoua Algeria', 'nature'],
    ['الضريح الملكي الموريتاني', 'Royal Mausoleum of Mauretania Algeria', 'history'],
  ]],
  ['43', 'ميلة', 'Mila', 36.45, 6.26, [
    ['المدينة القديمة بميلة', 'Mila old town Algeria', 'history'],
    ['الباب الروماني بميلة', 'Mila Roman gate Algeria', 'history'],
    ['سد بني هارون', 'Beni Haroun Dam Algeria', 'nature'],
  ]],
  ['44', 'عين الدفلى', 'Aïn Defla', 36.26, 1.97, [
    ['مدينة مليانة', 'Miliana Algeria', 'history'],
    ['حمام ريغة', 'Hammam Righa Algeria', 'nature'],
    ['جبال زكار', 'Zaccar mountains Algeria', 'nature'],
  ]],
  ['45', 'النعامة', 'Naâma', 33.27, -0.31, [
    ['عين الصفراء', 'Ain Sefra Algeria', 'culture'],
    ['قصر تيوت', 'Tiout ksar Algeria', 'history'],
    ['الحظيرة الوطنية جبل عيسى', 'Djebel Aissa National Park Algeria', 'nature'],
  ]],
  ['46', 'عين تموشنت', 'Aïn Témouchent', 35.30, -1.14, [
    ['موقع سيغا الأثري', 'Siga archaeological site Algeria', 'history'],
    ['ميناء بني صاف', 'Beni Saf Algeria', 'culture'],
    ['جزيرة رشقون', 'Rechgoun island Algeria', 'nature'],
  ]],
  ['47', 'غرداية', 'Ghardaïa', 32.49, 3.67, [
    ['وادي مزاب', 'M Zab Valley Algeria', 'history'],
    ['بني يزقن', 'Beni Isguen Ghardaia Algeria', 'culture'],
    ['العطف', 'El Atteuf Ghardaia Algeria', 'culture'],
  ]],
  ['48', 'غليزان', 'Relizane', 35.74, 0.56, [
    ['مدينة مازونة القديمة', 'Mazouna Algeria old town', 'history'],
    ['سد وادي مينا', 'Oued Mina dam Algeria', 'nature'],
    ['وادي رهيو', 'Oued Rhiou Algeria', 'culture'],
  ]],
  ['49', 'تيميمون', 'Timimoun', 29.26, 0.23, [
    ['قصر تيميمون', 'Timimoun ksar Algeria', 'history'],
    ['واحات تيميمون الحمراء', 'Timimoun red oasis Algeria', 'nature'],
    ['سبخة تيميمون', 'Sebkha Timimoun Algeria', 'nature'],
  ]],
  ['50', 'برج باجي مختار', 'Bordj Badji Mokhtar', 21.33, 0.95, [
    ['مدينة برج باجي مختار', 'Bordj Badji Mokhtar Algeria', 'culture'],
    ['صحراء العرق الغربي', 'Erg Chech Algeria', 'nature'],
    ['مسارات تافيلالت الصحراوية', 'Tafilet Algeria Sahara', 'nature'],
  ]],
  ['51', 'أولاد جلال', 'Ouled Djellal', 34.43, 5.06, [
    ['واحة أولاد جلال', 'Ouled Djellal oasis Algeria', 'nature'],
    ['ضريح سيدي خالد', 'Sidi Khaled Algeria mausoleum', 'history'],
    ['قصور أولاد جلال', 'Ouled Djellal ksour Algeria', 'culture'],
  ]],
  ['52', 'بني عباس', 'Béni Abbès', 30.13, -2.17, [
    ['قصر بني عباس', 'Beni Abbes ksar Algeria', 'history'],
    ['واحة الساورة', 'Saoura oasis Algeria', 'nature'],
    ['جبال أوڨارتة', 'Ougarta mountains Algeria', 'nature'],
  ]],
  ['53', 'عين صالح', 'In Salah', 27.20, 2.47, [
    ['قصر عين صالح', 'In Salah ksar Algeria', 'history'],
    ['واحات عين صالح', 'In Salah oasis Algeria', 'nature'],
    ['الفقارات التقليدية', 'Foggara In Salah Algeria', 'culture'],
  ]],
  ['54', 'عين قزام', 'In Guezzam', 19.57, 5.77, [
    ['مدينة عين قزام', 'In Guezzam Algeria', 'culture'],
    ['تن زواتين', 'Tin Zaouatine Algeria', 'nature'],
    ['مسالك تازروفت', 'Tanezrouft Algeria', 'nature'],
  ]],
  ['55', 'تقرت', 'Touggourt', 33.10, 6.06, [
    ['قصر تقرت القديم', 'Touggourt old ksar Algeria', 'history'],
    ['مدينة تماسين', 'Temacine Algeria', 'culture'],
    ['مسجد مستاوة', 'Mestaoua Mosque Algeria', 'history'],
  ]],
  ['56', 'جانت', 'Djanet', 24.55, 9.48, [
    ['تاسيلي ناجر', 'Tassili n Ajjer Djanet Algeria', 'history'],
    ['واحة إهرير', 'Iherir oasis Djanet Algeria', 'nature'],
    ['قصر جانت القديم', 'Djanet old town Algeria', 'culture'],
  ]],
  ['57', 'المغير', 'El M’Ghair', 33.95, 5.92, [
    ['واحات المغير', 'El M Ghair oasis Algeria', 'nature'],
    ['مدينة أم الطيور', 'Oum Tiour Algeria', 'culture'],
    ['جامع جامعة العتيق', 'Djamaa old mosque Algeria', 'history'],
  ]],
  ['58', 'المنيعة', 'El Meniaa', 30.58, 2.88, [
    ['قصر المنيعة', 'El Meniaa ksar Algeria', 'history'],
    ['بحيرة المنيعة', 'El Meniaa lake Algeria', 'nature'],
    ['واحة المنيعة', 'El Meniaa oasis Algeria', 'nature'],
  ]],
];

export const WILAYAS: Wilaya[] = seeds.map(([code, name, latin, latitude, longitude]) => ({
  code,
  id: code,
  name,
  latin,
  latitude,
  longitude,
}));

export const PLACES: Place[] = seeds.flatMap(([code, name, latin, latitude, longitude, attractions]) =>
  attractions.map(([placeName, imageQuery, kind], index) => ({
    id: `${code}-${index + 1}`,
    name: placeName,
    imageQuery,
    kind,
    wilayaId: code,
    wilayaName: name,
    latitude,
    longitude,
    summary: `${placeName} من الوجهات التي تعرّف بتنوع ولاية ${name}. يعرض التطبيق نبذة موسوعية عند توفرها، مع رابط إلى المصدر وصورة من ويكيميديا كومنز.`,
  })),
);

export const FOODS: Place[] = [
  { id: 'food-couscous', name: 'الكسكس', imageQuery: 'Algerian couscous dish', kind: 'food', wilayaId: '16', wilayaName: 'الجزائر العاصمة', latitude: 36.75, longitude: 3.06, summary: 'طبق جزائري تقليدي من حبوب السميد المطهوة على البخار، ويقدّم بصيغ محلية متعددة.' },
  { id: 'food-chakhchoukha', name: 'الشخشوخة', imageQuery: 'Chakhchoukha Algerian dish', kind: 'food', wilayaId: '05', wilayaName: 'باتنة', latitude: 35.56, longitude: 6.17, summary: 'طبق من رقائق العجين المفتتة مع المرق، تشتهر به مناطق من الشرق الجزائري.' },
  { id: 'food-rechta', name: 'الرشتة', imageQuery: 'Rechta Algerian dish', kind: 'food', wilayaId: '16', wilayaName: 'الجزائر العاصمة', latitude: 36.75, longitude: 3.06, summary: 'عجائن رفيعة تقدّم غالبًا مع مرق أبيض بالدجاج والحمص، وترتبط بمطبخ العاصمة.' },
  { id: 'food-chorba', name: 'شربة فريك', imageQuery: 'Chorba frik Algerian soup', kind: 'food', wilayaId: '25', wilayaName: 'قسنطينة', latitude: 36.37, longitude: 6.61, summary: 'حساء جزائري بالفريك والطماطم والأعشاب، حاضر على موائد كثيرة خصوصًا في رمضان.' },
  { id: 'food-mhadjeb', name: 'المحاجب', imageQuery: 'Mhadjeb Algerian food', kind: 'food', wilayaId: '17', wilayaName: 'الجلفة', latitude: 34.67, longitude: 3.25, summary: 'خبز رقيق محشو بالبصل والطماطم والفلفل، ويباع في البيوت والأسواق الشعبية.' },
  { id: 'food-makroud', name: 'المقروط', imageQuery: 'Makroud Algerian pastry', kind: 'food', wilayaId: '07', wilayaName: 'بسكرة', latitude: 34.85, longitude: 5.73, summary: 'حلوى سميد محشوة غالبًا بالتمر، معروفة في عدة مناطق جزائرية وبخاصة بسكرة.' },
  { id: 'food-baghrir', name: 'البغرير', imageQuery: 'Baghrir Algerian pancakes', kind: 'food', wilayaId: '09', wilayaName: 'البليدة', latitude: 36.47, longitude: 2.83, summary: 'فطائر سميد خفيفة ذات ثقوب صغيرة، تقدم عادة بالعسل والزبدة.' },
  { id: 'food-doubara', name: 'الدوّارة البسكرية', imageQuery: 'Algerian douara dish', kind: 'food', wilayaId: '07', wilayaName: 'بسكرة', latitude: 34.85, longitude: 5.73, summary: 'طبق تقليدي مطهو ببطء، تختلف مكوناته وتوابله من منطقة إلى أخرى.' },
];

export const KIND_LABELS: Record<PlaceKind, string> = {
  nature: 'طبيعة',
  history: 'تاريخ',
  culture: 'ثقافة',
  hidden: 'جواهر مخفية',
  food: 'مأكولات',
};

export function wilayaById(id: string): Wilaya | undefined {
  return WILAYAS.find((item) => item.id === id);
}

export function placesForWilaya(id: string): Place[] {
  return PLACES.filter((place) => place.wilayaId === id);
}

export function allCatalogItems(): Place[] {
  return [...PLACES, ...FOODS];
}

export function hiddenPlaces(): Place[] {
  const chosen = new Set(['05-2', '06-1', '10-1', '17-2', '18-2', '33-2', '45-2', '49-3', '52-3', '56-2', '58-2']);
  return PLACES.filter((place) => chosen.has(place.id));
}
