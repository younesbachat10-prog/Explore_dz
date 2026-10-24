import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlgeriaMap, WikimediaImage } from '@/components/ExploreVisuals';
import { useExplore } from '@/context/ExploreContext';
import { allCatalogItems, FOODS, hiddenPlaces, KIND_LABELS, Place, PlaceKind, placesForWilaya, PLACES, Wilaya, WILAYAS } from '@/data/catalog';
import { useColors } from '@/hooks/useColors';

type Tab = 'home' | 'wilayas' | 'map' | 'discover' | 'favorites';
type Page = Tab | 'challenges' | 'wilaya' | 'place';
const tabs: Array<{ id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'home', label: 'الرئيسية', icon: 'home-outline' },
  { id: 'wilayas', label: 'الولايات', icon: 'grid-outline' },
  { id: 'map', label: 'الخريطة', icon: 'map-outline' },
  { id: 'discover', label: 'اكتشف', icon: 'compass-outline' },
  { id: 'favorites', label: 'المفضلة', icon: 'heart-outline' },
];
const challenges = [
  { id: 'places-3', title: 'خطوات أولى', description: 'اكتشف ثلاثة أماكن سياحية', target: 3, reward: 25, icon: 'footsteps-outline' as const, metric: 'places' as const },
  { id: 'wilayas-2', title: 'من ولاية إلى ولاية', description: 'تعرّف على ولايتين مختلفتين', target: 2, reward: 30, icon: 'map-outline' as const, metric: 'wilayas' as const },
  { id: 'favorites-2', title: 'احتفظ بالذكرى', description: 'أضف مكانين إلى المفضلة', target: 2, reward: 15, icon: 'heart-outline' as const, metric: 'favorites' as const },
];
const haptic = () => Haptics.selectionAsync().catch(() => undefined);
const isTab = (page: Page): page is Tab => ['home', 'wilayas', 'map', 'discover', 'favorites'].includes(page);

function FlagMark({ size = 40 }: { size?: number }) {
  const c = useColors();
  return (
    <View style={[s.flag, { width: size, height: size, borderRadius: size / 2, backgroundColor: c.accent }]}>
      <View style={[s.flagHalf, { width: size / 2, height: size, backgroundColor: c.primary }]} />
      <Ionicons name="moon" size={size * 0.46} color={c.destructive} style={s.flagMoon} />
      <Ionicons name="star" size={size * 0.18} color={c.destructive} style={s.flagStar} />
    </View>
  );
}

function Heading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const c = useColors();
  return <View style={s.heading}><Text style={[s.headingTitle, { color: c.foreground }]}>{title}</Text>
    {action && onAction ? <Pressable onPress={onAction}><Text style={[s.link, { color: c.primary }]}>{action}</Text></Pressable> : null}</View>;
}

function Chip({ title, active, onPress }: { title: string; active?: boolean; onPress: () => void }) {
  const c = useColors();
  return <Pressable onPress={onPress} style={[s.chip, { backgroundColor: active ? c.primary : c.card, borderColor: active ? c.primary : c.border }]}>
    <Text style={{ color: active ? c.primaryForeground : c.foreground, fontSize: 11, fontWeight: '700' }}>{title}</Text>
  </Pressable>;
}

function PlaceCard({ place, onPress, favorite, onFavorite }: { place: Place; onPress: () => void; favorite: boolean; onFavorite: () => void }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.placeCard, { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.92 : 1 }]}>
      <View style={s.placeImage}><WikimediaImage query={place.imageQuery} height={116} radius={15} /></View>
      <View style={s.placeInfo}>
        <View style={s.placeTop}><Text style={[s.kind, { color: c.primary }]}>{KIND_LABELS[place.kind]}</Text>
          <Pressable accessibilityLabel={favorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'} hitSlop={8} onPress={(event) => { event.stopPropagation(); onFavorite(); }}>
            <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={20} color={favorite ? c.destructive : c.mutedForeground} />
          </Pressable>
        </View>
        <Text numberOfLines={2} style={[s.placeName, { color: c.foreground }]}>{place.name}</Text>
        <Text numberOfLines={1} style={[s.placeWilaya, { color: c.mutedForeground }]}>{place.wilayaName}</Text>
        <View style={s.cardLink}><Text style={[s.link, { color: c.primary }]}>التفاصيل</Text><Ionicons name="arrow-back" size={14} color={c.primary} /></View>
      </View>
    </Pressable>
  );
}

function WilayaCard({ wilaya, onPress }: { wilaya: Wilaya; onPress: () => void }) {
  const c = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [s.wilayaCard, { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.85 : 1 }]}>
    <View style={[s.wilayaNumber, { backgroundColor: c.accent }]}><Text style={[s.wilayaCode, { color: c.primary }]}>{wilaya.code}</Text></View>
    <View style={s.wilayaText}><Text numberOfLines={1} style={[s.wilayaName, { color: c.foreground }]}>{wilaya.name}</Text><Text style={[s.wilayaLatin, { color: c.mutedForeground }]}>{wilaya.latin}</Text></View>
    <Ionicons name="chevron-back" size={16} color={c.mutedForeground} />
  </Pressable>;
}

function useArabicWiki(title?: string) {
  const [result, setResult] = useState<{ extract: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!title) return;
    let active = true;
    setLoading(true);
    setResult(null);
    const params = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: title, gsrnamespace: '0', gsrlimit: '1', prop: 'extracts|info', inprop: 'url', exintro: '1', explaintext: '1', redirects: '1', format: 'json', origin: '*' });
    fetch(`https://ar.wikipedia.org/w/api.php?${params}`)
      .then((r) => { if (!r.ok) throw new Error('تعذر تحميل المقال'); return r.json(); })
      .then((data: { query?: { pages?: Record<string, { extract?: string; fullurl?: string; title?: string }> } }) => {
        const page = Object.values(data.query?.pages ?? {})[0];
        if (active && page?.extract) setResult({ extract: page.extract.trim(), url: page.fullurl ?? `https://ar.wikipedia.org/wiki/${encodeURIComponent(page.title ?? title)}` });
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [title]);
  return { result, loading };
}

export default function ExploreApp() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const app = useExplore();
  const [screen, setScreen] = useState<Page>('home');
  const [returnTo, setReturnTo] = useState<Page>('home');
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya>();
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState<PlaceKind>('nature');
  const [visibleItems, setVisibleItems] = useState(9);
  const [wikiTitle, setWikiTitle] = useState<string>();
  const { result: wiki, loading: wikiLoading } = useArabicWiki(wikiTitle);
  const favoriteItems = useMemo(() => allCatalogItems().filter((p) => app.favoriteIds.includes(p.id)), [app.favoriteIds]);
  const shownWilayas = useMemo(() => {
    const q = search.trim().toLocaleLowerCase();
    return WILAYAS.filter((w) => !q || w.name.toLocaleLowerCase().includes(q) || w.latin.toLocaleLowerCase().includes(q) || w.code.includes(q));
  }, [search]);
  const goBack = () => setScreen(isTab(returnTo) ? returnTo : 'home');

  useEffect(() => {
    if (!['place', 'wilaya', 'challenges'].includes(screen)) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { goBack(); return true; });
    return () => sub.remove();
  }, [screen, returnTo]);

  const selectWilaya = (w: Wilaya) => {
    haptic(); setReturnTo(screen); setSelectedWilaya(w); setScreen('wilaya');
  };
  const selectPlace = (p: Place) => {
    haptic(); setReturnTo(screen); setSelectedPlace(p); setWikiTitle(`${p.name} ${p.wilayaName}`); app.visitPlace(p.id, p.wilayaId); setScreen('place');
  };
  const openChallenges = () => { setReturnTo(screen); setScreen('challenges'); };
  const tabPress = (tab: Tab) => { haptic(); setScreen(tab); };
  const toggleFavorite = (id: string) => { haptic(); app.toggleFavorite(id); };
  const externalMap = (w: Wilaya) => Linking.openURL(`https://www.openstreetmap.org/?mlat=${w.latitude}&mlon=${w.longitude}#map=11/${w.latitude}/${w.longitude}`).catch(() => undefined);
  const top = (title: string, subtitle?: string, back = false) => (
    <View style={s.topBar}>
      {back ? <Pressable accessibilityLabel="رجوع" onPress={goBack} style={[s.iconButton, { backgroundColor: c.card }]}><Ionicons name="arrow-forward" size={20} color={c.foreground} /></Pressable>
        : <Pressable accessibilityLabel="التحديات والنقاط" onPress={openChallenges} style={[s.pointsBadge, { backgroundColor: c.card }]}><Ionicons name="sparkles" size={15} color={c.primary} /><Text style={[s.points, { color: c.foreground }]}>{app.points}</Text></Pressable>}
      <View style={s.topTitles}><Text style={[s.topTitle, { color: c.foreground }]}>{title}</Text>{subtitle ? <Text style={[s.topSubtitle, { color: c.mutedForeground }]}>{subtitle}</Text> : null}</View>
      {back ? <View style={{ width: 42 }} /> : <FlagMark size={38} />}
    </View>
  );

  if (!app.ready) return <SafeAreaView style={[s.root, { backgroundColor: c.background, justifyContent: 'center', alignItems: 'center' }]}><FlagMark size={54} /><Text style={[s.body, { color: c.mutedForeground, marginTop: 14 }]}>نحضّر رحلتك…</Text></SafeAreaView>;

  if (!app.hasEntered) return (
    <SafeAreaView style={[s.root, { backgroundColor: c.background, paddingTop: Platform.OS === 'web' ? 67 : 0 }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={s.welcome} showsVerticalScrollIndicator={false}>
        <View pointerEvents="none" style={s.watermark}><FlagMark size={260} /></View>
        <View style={s.brandRow}><FlagMark size={46} /><View><Text style={[s.brandTitle, { color: c.foreground }]}>اكتشف الجزائر</Text><Text style={[s.brandLatin, { color: c.mutedForeground }]}>EXPLORE DZ</Text></View></View>
        <View style={s.welcomePhoto}><WikimediaImage query="Sahara desert Algeria dunes" height={310} radius={28} />
          <View style={[s.welcomeOverlay, { backgroundColor: c.foreground }]}><FlagMark size={47} /><Text style={[s.welcomeHeroTitle, { color: c.primaryForeground }]}>مرحبًا بكم{'\n'}في الجزائر</Text><Text style={[s.welcomeHeroText, { color: c.primaryForeground }]}>من أزقة القصبة إلى صمت الصحراء، اكتشف حكاية كل مكان.</Text></View>
        </View>
        <Text style={[s.welcomeTitle, { color: c.foreground }]}>رحلتك تبدأ من هنا</Text>
        <Text style={[s.body, { color: c.mutedForeground }]}>58 ولاية، معالم من التاريخ، طبيعة لا تشبه غيرها، ومذاقات تستحق التجربة.</Text>
        <Pressable testID="enter-explore" onPress={() => { haptic(); app.enterAsGuest(); }} style={({ pressed }) => [s.primaryButton, { backgroundColor: c.primary, opacity: pressed ? 0.88 : 1 }]}>
          <Text style={[s.primaryButtonText, { color: c.primaryForeground }]}>الدخول كزائر</Text><Ionicons name="arrow-back" size={18} color={c.primaryForeground} />
        </Pressable>
        <Text style={[s.guestNote, { color: c.mutedForeground }]}>تُحفظ المفضلة والنقاط على هذا الجهاز</Text>
      </ScrollView>
    </SafeAreaView>
  );

  const renderHome = () => (
    <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      {top('مرحبًا بك، مكتشف الجزائر', 'مغامرة جديدة في كل ولاية')}
      <Pressable onPress={() => tabPress('wilayas')} style={s.homeHero}>
        <WikimediaImage query="Tassili n Ajjer rocky desert landscape Algeria" height={244} radius={26} />
        <View style={[s.heroOverlay, { backgroundColor: c.foreground }]}>
          <View style={[s.heroTag, { backgroundColor: c.primary }]}><Ionicons name="compass-outline" size={14} color={c.primaryForeground} /><Text style={[s.heroTagText, { color: c.primaryForeground }]}>اكتشف على طريقتك</Text></View>
          <Text style={[s.heroTitle, { color: c.primaryForeground }]}>من الشمال إلى{'\n'}أعماق الصحراء</Text>
          <View style={s.heroAction}><Text style={[s.heroActionText, { color: c.primaryForeground }]}>تصفّح الولايات</Text><Ionicons name="arrow-back" size={15} color={c.primaryForeground} /></View>
        </View>
      </Pressable>
      <Pressable onPress={openChallenges} style={[s.scoreCard, { backgroundColor: c.primary }]}>
        <View style={[s.scoreIcon, { backgroundColor: c.accent }]}><Ionicons name="trophy-outline" size={21} color={c.primary} /></View>
        <View style={s.scoreCopy}><Text style={[s.scoreTitle, { color: c.primaryForeground }]}>واصل الاكتشاف واربح النقاط</Text><Text style={[s.scoreDesc, { color: c.primaryForeground }]}>لديك {app.points} نقطة · تحديات قصيرة تنتظرك</Text></View>
        <Ionicons name="arrow-back" size={18} color={c.primaryForeground} />
      </Pressable>
      <Heading title="اختر نوع الرحلة" action="كل الأقسام" onAction={() => tabPress('discover')} />
      <View style={s.categoryGrid}>
        {([
          ['nature', 'الطبيعة', 'leaf-outline'], ['history', 'التاريخ', 'time-outline'],
          ['food', 'المأكولات', 'restaurant-outline'], ['hidden', 'أماكن مخفية', 'eye-outline'],
        ] as const).map(([id, title, icon]) => <Pressable key={id} onPress={() => { setKind(id); setVisibleItems(9); tabPress('discover'); }} style={[s.categoryTile, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[s.categoryIcon, { backgroundColor: c.accent }]}><Ionicons name={icon} size={20} color={c.primary} /></View><Text style={[s.categoryLabel, { color: c.foreground }]}>{title}</Text>
        </Pressable>)}
      </View>
      <Heading title="وجهات تستحق الزيارة" action="عرض الكل" onAction={() => tabPress('discover')} />
      {PLACES.filter((p) => ['16-1', '05-1', '42-1', '06-1'].includes(p.id)).map((p) =>
        <PlaceCard key={p.id} place={p} onPress={() => selectPlace(p)} favorite={app.favoriteIds.includes(p.id)} onFavorite={() => toggleFavorite(p.id)} />)}
      <View style={s.spacer} />
    </ScrollView>
  );

  const renderWilayas = () => (
    <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {top('ولايات الجزائر', 'الولايات الـ58 بترتيبها الرسمي')}
      <View style={[s.searchBox, { backgroundColor: c.card, borderColor: c.border }]}><Ionicons name="search" size={19} color={c.mutedForeground} />
        <TextInput value={search} onChangeText={setSearch} placeholder="ابحث عن ولاية أو رقمها" placeholderTextColor={c.mutedForeground} style={[s.searchInput, { color: c.foreground }]} textAlign="right" returnKeyType="search" />
        {search ? <Pressable onPress={() => setSearch('')}><Ionicons name="close-circle" size={19} color={c.mutedForeground} /></Pressable> : null}
      </View>
      <View style={s.countRow}><Text style={[s.small, { color: c.mutedForeground }]}>{shownWilayas.length} ولاية</Text><Text style={[s.small, { color: c.mutedForeground }]}>اضغط لعرض المعالم</Text></View>
      <View style={s.wilayaGrid}>{shownWilayas.map((w) => <View key={w.id} style={s.wilayaGridItem}><WilayaCard wilaya={w} onPress={() => selectWilaya(w)} /></View>)}</View>
      <View style={s.spacer} />
    </ScrollView>
  );

  const renderMap = () => (
    <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      {top('خريطة الجزائر', 'المس علامة الولاية لفتح دليلها')}
      <AlgeriaMap onSelect={selectWilaya} />
      <View style={[s.notice, { backgroundColor: c.card, borderColor: c.border }]}><Ionicons name="information-circle-outline" size={20} color={c.primary} />
        <Text style={[s.noticeText, { color: c.mutedForeground }]}>خريطة استكشافية مبسطة بإحداثيات المدن؛ اضغط على العلامات لفتح الولاية، ثم افتح موقعها على OpenStreetMap.</Text>
      </View>
      <Heading title="ولايات مقترحة" />
      {WILAYAS.slice(0, 5).map((w) => <WilayaCard key={w.id} wilaya={w} onPress={() => selectWilaya(w)} />)}
      <View style={s.spacer} />
    </ScrollView>
  );

  const renderDiscover = () => {
    const kinds: PlaceKind[] = ['nature', 'history', 'culture', 'food', 'hidden'];
    const list = kind === 'food' ? FOODS : kind === 'hidden' ? hiddenPlaces() : PLACES.filter((p) => p.kind === kind);
    return <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      {top('اكتشف الجزائر', 'اختَر حكاية، ثم ابدأ رحلتك')}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRow}>
        {kinds.map((value) => <Chip key={value} title={KIND_LABELS[value]} active={kind === value} onPress={() => { setKind(value); setVisibleItems(9); }} />)}
      </ScrollView>
      <View style={[s.discoveryIntro, { backgroundColor: c.accent }]}><Ionicons name="sparkles-outline" size={21} color={c.primary} />
        <View style={s.discoveryCopy}><Text style={[s.discoveryTitle, { color: c.foreground }]}>{KIND_LABELS[kind]}</Text><Text style={[s.small, { color: c.mutedForeground }]}>{list.length} اقتراحًا من أنحاء الجزائر</Text></View>
      </View>
      {list.slice(0, visibleItems).map((p) => <PlaceCard key={p.id} place={p} onPress={() => selectPlace(p)} favorite={app.favoriteIds.includes(p.id)} onFavorite={() => toggleFavorite(p.id)} />)}
      {visibleItems < list.length ? <Pressable onPress={() => setVisibleItems((count) => count + 9)} style={[s.secondaryButton, { borderColor: c.primary, alignSelf: 'center' }]}><Text style={[s.link, { color: c.primary }]}>عرض المزيد</Text></Pressable> : null}
      <View style={s.spacer} />
    </ScrollView>;
  };

  const renderFavorites = () => <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    {top('الأماكن المحفوظة', `${favoriteItems.length} مكان في قائمتك`)}
    {favoriteItems.length ? favoriteItems.map((p) => <PlaceCard key={p.id} place={p} onPress={() => selectPlace(p)} favorite onFavorite={() => toggleFavorite(p.id)} />) :
      <View style={[s.empty, { backgroundColor: c.card, borderColor: c.border }]}><View style={[s.emptyIcon, { backgroundColor: c.accent }]}><Ionicons name="heart-outline" size={27} color={c.primary} /></View>
        <Text style={[s.emptyTitle, { color: c.foreground }]}>قائمة رحلتك تبدأ هنا</Text><Text style={[s.body, { color: c.mutedForeground }]}>احفظ الأماكن التي أعجبتك لتجدها هنا بسرعة.</Text>
        <Pressable onPress={() => tabPress('discover')} style={[s.secondaryButton, { borderColor: c.primary }]}><Text style={{ color: c.primary, fontWeight: '700', fontSize: 12 }}>اكتشف الأماكن</Text></Pressable>
      </View>}
    <View style={s.spacer} />
  </ScrollView>;

  const renderWilayaDetail = () => {
    if (!selectedWilaya) return null;
    const spots = placesForWilaya(selectedWilaya.id);
    return <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      {top(selectedWilaya.name, `الولاية رقم ${selectedWilaya.code} · ${selectedWilaya.latin}`, true)}
      <View style={s.detailHero}><WikimediaImage query={`${selectedWilaya.latin} Algeria landscape`} height={230} radius={24} />
        <View style={[s.detailLabel, { backgroundColor: c.card }]}><Text style={[s.wilayaCode, { color: c.primary }]}>{selectedWilaya.code}</Text><Text style={[s.detailLabelText, { color: c.foreground }]}>{selectedWilaya.name}</Text></View>
      </View>
      <Text style={[s.body, { color: c.mutedForeground }]}>ثلاث وجهات مختارة في {selectedWilaya.name}. افتح أي مكان للاطلاع على معلومات موسوعية وصور عند توفرها.</Text>
      <Heading title="أماكن للزيارة" />
      {spots.map((p) => <PlaceCard key={p.id} place={p} onPress={() => selectPlace(p)} favorite={app.favoriteIds.includes(p.id)} onFavorite={() => toggleFavorite(p.id)} />)}
      <Heading title="الموقع الجغرافي" />
      <Pressable onPress={() => externalMap(selectedWilaya)}><AlgeriaMap selectedId={selectedWilaya.id} onSelect={selectWilaya} compact /><Text style={[s.mapLink, { color: c.primary }]}>افتحها على OpenStreetMap</Text></Pressable>
      <View style={s.spacer} />
    </ScrollView>;
  };

  const renderPlaceDetail = () => {
    if (!selectedPlace) return null;
    const w = WILAYAS.find((item) => item.id === selectedPlace.wilayaId) ?? WILAYAS[0];
    return <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      {top(selectedPlace.name, selectedPlace.wilayaName, true)}
      <WikimediaImage query={selectedPlace.imageQuery} height={300} radius={24} />
      <View style={s.detailMeta}><Chip title={KIND_LABELS[selectedPlace.kind]} active onPress={() => undefined} />
        <Pressable onPress={() => toggleFavorite(selectedPlace.id)} style={[s.favoriteAction, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name={app.favoriteIds.includes(selectedPlace.id) ? 'heart' : 'heart-outline'} size={19} color={c.destructive} />
          <Text style={[s.favoriteText, { color: c.foreground }]}>{app.favoriteIds.includes(selectedPlace.id) ? 'في المفضلة' : 'أضف للمفضلة'}</Text>
        </Pressable>
      </View>
      <Text style={[s.detailTitle, { color: c.foreground }]}>{selectedPlace.name}</Text>
      <Text style={[s.detailSub, { color: c.mutedForeground }]}>{selectedPlace.wilayaName} · الجزائر</Text>
      <Heading title="نبذة عن المكان" />
      {wikiLoading ? <View style={[s.wikiLoading, { backgroundColor: c.card }]}><Text style={[s.small, { color: c.mutedForeground }]}>نبحث عن معلومات موسوعية…</Text></View>
        : <Text style={[s.article, { color: c.foreground }]}>{wiki?.extract || selectedPlace.summary}</Text>}
      {wiki?.url ? <Pressable onPress={() => Linking.openURL(wiki.url).catch(() => undefined)} style={s.sourceLink}><Ionicons name="open-outline" size={16} color={c.primary} /><Text style={[s.link, { color: c.primary }]}>المصدر: ويكيبيديا العربية</Text></Pressable>
        : <Text style={[s.sourceNote, { color: c.mutedForeground }]}>الصور من ويكيميديا كومنز؛ لم تتوفر مقالة عربية مطابقة لهذا الاسم.</Text>}
      <Heading title="صور من ويكيميديا كومنز" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.gallery}>{[0, 1, 2, 3].map((i) =>
        <View key={i} style={s.galleryImage}><WikimediaImage query={selectedPlace.imageQuery} height={145} radius={17} index={i} /></View>)}</ScrollView>
      <Heading title="الموقع الجغرافي" />
      <Pressable onPress={() => externalMap(w)} style={[s.coordinates, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={[s.coordinateIcon, { backgroundColor: c.accent }]}><Ionicons name="location-outline" size={22} color={c.primary} /></View>
        <View style={s.coordinateCopy}><Text style={[s.coordinateTitle, { color: c.foreground }]}>{selectedPlace.wilayaName}</Text>
          <Text style={[s.small, { color: c.mutedForeground }]}>{selectedPlace.latitude.toFixed(4)}° ، {selectedPlace.longitude.toFixed(4)}°</Text></View>
        <Ionicons name="open-outline" size={18} color={c.primary} />
      </Pressable>
      <View style={s.detailMap}><AlgeriaMap selectedId={selectedPlace.wilayaId} onSelect={selectWilaya} compact /></View>
      <View style={[s.pointsHint, { backgroundColor: c.accent }]}><Ionicons name="sparkles-outline" size={17} color={c.primary} />
        <Text style={[s.small, { color: c.foreground, flex: 1 }]}>{app.visitedPlaceIds.length} مكانًا اكتشفت · تحصل على 5 نقاط عند زيارة مكان جديد</Text></View>
      <View style={s.spacer} />
    </ScrollView>;
  };

  const renderChallenges = () => {
    const progress = (metric: 'places' | 'wilayas' | 'favorites') => metric === 'places' ? app.visitedPlaceIds.length : metric === 'wilayas' ? app.visitedWilayaIds.length : app.favoriteIds.length;
    return <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      {top('التحديات', 'خطوات صغيرة تفتح لك أماكن جديدة', true)}
      <View style={[s.challengeSummary, { backgroundColor: c.primary }]}><Ionicons name="trophy" size={29} color={c.primaryForeground} />
        <View style={s.challengeSummaryCopy}><Text style={[s.challengePoints, { color: c.primaryForeground }]}>{app.points} نقطة</Text><Text style={[s.small, { color: c.primaryForeground }]}>رصيدك الحالي</Text></View><Ionicons name="sparkles" size={20} color={c.primaryForeground} />
      </View>
      <Text style={[s.body, { color: c.mutedForeground }]}>اكسب النقاط باكتشاف الأماكن وحفظها. إنجازاتك محفوظة على هذا الجهاز.</Text>
      {challenges.map((item) => {
        const count = progress(item.metric);
        const claimed = app.claimedChallenges.includes(item.id);
        const done = count >= item.target;
        return <View key={item.id} style={[s.challengeCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[s.challengeIcon, { backgroundColor: c.accent }]}><Ionicons name={item.icon} size={22} color={c.primary} /></View>
          <View style={s.challengeInfo}>
            <View style={s.challengeTop}><Text style={[s.challengeTitle, { color: c.foreground }]}>{item.title}</Text><Text style={[s.reward, { color: c.primary }]}>+{item.reward}</Text></View>
            <Text style={[s.small, { color: c.mutedForeground }]}>{item.description}</Text>
            <View style={[s.progressTrack, { backgroundColor: c.muted }]}><View style={[s.progressFill, { backgroundColor: c.primary, width: `${Math.min(100, count / item.target * 100)}%` }]} /></View>
            <View style={s.challengeBottom}><Text style={[s.small, { color: c.mutedForeground }]}>{Math.min(count, item.target)} من {item.target}</Text>
              <Pressable disabled={!done || claimed} onPress={() => { app.claimChallenge(item.id, item.reward, done); haptic(); }}
                style={[s.claimButton, { backgroundColor: claimed ? c.muted : done ? c.primary : c.background, borderColor: !done && !claimed ? c.border : 'transparent', borderWidth: 1 }]}>
                <Text style={{ color: claimed || !done ? c.mutedForeground : c.primaryForeground, fontSize: 10, fontWeight: '700' }}>{claimed ? 'تم الاستلام' : done ? 'استلم' : 'تابع'}</Text>
              </Pressable>
            </View>
          </View>
        </View>;
      })}
      <View style={s.spacer} />
    </ScrollView>;
  };

  const page = screen === 'home' ? renderHome()
    : screen === 'wilayas' ? renderWilayas()
      : screen === 'map' ? renderMap()
        : screen === 'discover' ? renderDiscover()
          : screen === 'favorites' ? renderFavorites()
            : screen === 'wilaya' ? renderWilayaDetail()
              : screen === 'place' ? renderPlaceDetail() : renderChallenges();

  return <SafeAreaView style={[s.root, { backgroundColor: c.background, paddingTop: Platform.OS === 'web' ? 67 : 0 }]}>
    <StatusBar style="dark" />
    <View style={s.main}>{page}</View>
    <View style={[s.tabs, { backgroundColor: c.card, borderColor: c.border, paddingBottom: Platform.OS === 'web' ? 0 : Math.max(insets.bottom, 8), height: Platform.OS === 'web' ? 84 : undefined }]}>
      {tabs.map((tab) => {
        const active = screen === tab.id;
        return <Pressable key={tab.id} accessibilityRole="button" accessibilityLabel={tab.label} accessibilityState={{ selected: active }} onPress={() => tabPress(tab.id)} style={s.tab}>
          <View style={[s.tabIcon, active ? { backgroundColor: c.accent } : null]}><Ionicons name={active ? tab.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap : tab.icon} size={21} color={active ? c.primary : c.mutedForeground} /></View>
          <Text style={[s.tabLabel, { color: active ? c.primary : c.mutedForeground }]}>{tab.label}</Text>
        </Pressable>;
      })}
    </View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  root: { flex: 1 }, main: { flex: 1 }, page: { paddingHorizontal: 19, paddingTop: 10, paddingBottom: 18, gap: 13 }, welcome: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 38 },
  flag: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, flagHalf: { position: 'absolute', left: 0, top: 0, opacity: 0.23 }, flagMoon: { position: 'absolute', left: '31%', top: '28%' }, flagStar: { position: 'absolute', left: '51%', top: '43%' },
  brandRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginBottom: 22 }, brandTitle: { fontSize: 20, fontWeight: '800', writingDirection: 'rtl' }, brandLatin: { fontSize: 9, fontWeight: '700', letterSpacing: 2.4, marginTop: 2 },
  welcomePhoto: { borderRadius: 28, overflow: 'hidden', marginBottom: 25 }, welcomeOverlay: { position: 'absolute', left: 15, right: 15, bottom: 15, padding: 18, borderRadius: 21, opacity: 0.9 },
  watermark: { position: 'absolute', top: 105, right: -105, opacity: 0.08 },
  welcomeHeroTitle: { fontSize: 30, lineHeight: 40, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl', marginTop: 12 }, welcomeHeroText: { opacity: 0.87, fontSize: 13, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl', marginTop: 6, maxWidth: 280 },
  welcomeTitle: { fontSize: 24, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl', marginTop: 1 }, body: { fontSize: 13, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl', marginTop: 5 }, small: { fontSize: 10, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  primaryButton: { minHeight: 56, borderRadius: 18, paddingHorizontal: 20, marginTop: 22, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 10 }, primaryButtonText: { fontSize: 16, fontWeight: '700', writingDirection: 'rtl' }, guestNote: { textAlign: 'center', fontSize: 11, marginTop: 10, writingDirection: 'rtl' },
  topBar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, minHeight: 54 }, topTitles: { flex: 1, alignItems: 'flex-end', paddingHorizontal: 11 }, topTitle: { fontSize: 18, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' }, topSubtitle: { fontSize: 10, marginTop: 2, textAlign: 'right', writingDirection: 'rtl' },
  iconButton: { width: 42, height: 42, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }, pointsBadge: { height: 38, minWidth: 64, paddingHorizontal: 10, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, points: { fontSize: 13, fontWeight: '800' },
  homeHero: { borderRadius: 26, overflow: 'hidden', marginBottom: 4 }, heroOverlay: { position: 'absolute', bottom: 12, left: 12, right: 12, borderRadius: 21, padding: 16, opacity: 0.9 },
  heroTag: { flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-start', gap: 5, paddingVertical: 5, paddingHorizontal: 9, borderRadius: 20 }, heroTagText: { fontSize: 10, fontWeight: '600' },
  heroTitle: { fontSize: 25, lineHeight: 33, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl', marginTop: 10 }, heroAction: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, marginTop: 11 }, heroActionText: { fontSize: 12, fontWeight: '700', writingDirection: 'rtl' },
  scoreCard: { minHeight: 76, borderRadius: 21, paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row-reverse', alignItems: 'center', gap: 11, marginBottom: 4 }, scoreIcon: { width: 39, height: 39, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, scoreCopy: { flex: 1, alignItems: 'flex-end' }, scoreTitle: { fontSize: 13, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' }, scoreDesc: { fontSize: 10, opacity: 0.82, marginTop: 3, textAlign: 'right', writingDirection: 'rtl' },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 7, marginBottom: 1 }, headingTitle: { fontSize: 16, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' }, link: { fontSize: 11, fontWeight: '700', writingDirection: 'rtl' },
  categoryGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }, categoryTile: { width: '48%', minHeight: 78, borderRadius: 18, borderWidth: 1, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }, categoryIcon: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, categoryLabel: { fontSize: 12, fontWeight: '700', flex: 1, textAlign: 'right', writingDirection: 'rtl' },
  placeCard: { borderRadius: 20, borderWidth: 1, padding: 9, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, minHeight: 134 }, placeImage: { width: 110, overflow: 'hidden', borderRadius: 15 }, placeInfo: { flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 4 }, placeTop: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  kind: { fontSize: 10, fontWeight: '700', writingDirection: 'rtl' }, placeName: { fontSize: 13, lineHeight: 21, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl', marginTop: 5 }, placeWilaya: { fontSize: 10, textAlign: 'right', writingDirection: 'rtl', marginTop: 3 }, cardLink: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginTop: 8 },
  chip: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 }, chipRow: { flexDirection: 'row-reverse', gap: 8, paddingVertical: 3 },
  searchBox: { borderWidth: 1, borderRadius: 16, minHeight: 50, paddingHorizontal: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }, searchInput: { flex: 1, fontSize: 13, paddingVertical: 10, writingDirection: 'rtl' }, countRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 2 },
  wilayaGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 9 }, wilayaGridItem: { width: '48.5%' }, wilayaCard: { minHeight: 68, borderRadius: 16, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 9, flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  wilayaNumber: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, wilayaCode: { fontSize: 11, fontWeight: '800' }, wilayaText: { flex: 1, alignItems: 'flex-end' }, wilayaName: { fontSize: 11, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' }, wilayaLatin: { fontSize: 8, marginTop: 2, textAlign: 'right' },
  notice: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 9 }, noticeText: { flex: 1, fontSize: 11, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' }, discoveryIntro: { borderRadius: 18, paddingHorizontal: 15, paddingVertical: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 11 }, discoveryCopy: { flex: 1, alignItems: 'flex-end' }, discoveryTitle: { fontSize: 15, fontWeight: '800', writingDirection: 'rtl' },
  empty: { borderWidth: 1, borderRadius: 22, padding: 22, alignItems: 'center', marginTop: 30 }, emptyIcon: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }, emptyTitle: { fontSize: 16, fontWeight: '800', writingDirection: 'rtl' }, secondaryButton: { borderWidth: 1, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 14, marginTop: 17 },
  detailHero: { position: 'relative', marginBottom: 4 }, detailLabel: { position: 'absolute', bottom: 11, right: 11, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 9, flexDirection: 'row-reverse', alignItems: 'center', gap: 9 }, detailLabelText: { fontSize: 13, fontWeight: '800', writingDirection: 'rtl' }, mapLink: { fontSize: 11, fontWeight: '700', textAlign: 'center', marginTop: 7, writingDirection: 'rtl' },
  detailMeta: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }, favoriteAction: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }, favoriteText: { fontSize: 11, fontWeight: '700', writingDirection: 'rtl' },
  detailTitle: { fontSize: 24, lineHeight: 33, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl', marginTop: 4 }, detailSub: { fontSize: 12, textAlign: 'right', writingDirection: 'rtl', marginTop: -5 }, wikiLoading: { borderRadius: 16, padding: 14, alignItems: 'flex-end' }, article: { fontSize: 14, lineHeight: 26, textAlign: 'right', writingDirection: 'rtl' }, sourceLink: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 6 }, sourceNote: { fontSize: 10, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  gallery: { flexDirection: 'row-reverse', gap: 10 }, galleryImage: { width: 190 }, coordinates: { borderWidth: 1, borderRadius: 17, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }, coordinateIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, coordinateCopy: { flex: 1, alignItems: 'flex-end' }, coordinateTitle: { fontSize: 13, fontWeight: '800', writingDirection: 'rtl' }, detailMap: { marginTop: 3 }, pointsHint: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, padding: 12, borderRadius: 15 },
  challengeSummary: { minHeight: 93, borderRadius: 22, padding: 18, flexDirection: 'row-reverse', alignItems: 'center', gap: 13 }, challengeSummaryCopy: { flex: 1, alignItems: 'flex-end' }, challengePoints: { fontSize: 22, fontWeight: '800', writingDirection: 'rtl' },
  challengeCard: { borderWidth: 1, borderRadius: 20, padding: 13, flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 11 }, challengeIcon: { width: 43, height: 43, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }, challengeInfo: { flex: 1 }, challengeTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }, challengeTitle: { fontSize: 13, fontWeight: '800', writingDirection: 'rtl' }, reward: { fontSize: 12, fontWeight: '800' }, progressTrack: { height: 6, borderRadius: 5, overflow: 'hidden', marginTop: 10 }, progressFill: { height: '100%', borderRadius: 5 }, challengeBottom: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }, claimButton: { minWidth: 72, alignItems: 'center', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 12 },
  tabs: { minHeight: 64, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingTop: 5 }, tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 51 }, tabIcon: { width: 42, height: 29, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, tabLabel: { fontSize: 9, fontWeight: '600', writingDirection: 'rtl' }, spacer: { height: 14 },
});
