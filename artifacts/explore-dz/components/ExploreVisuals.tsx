import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';
import { WILAYAS, Wilaya } from '@/data/catalog';

interface CommonsImage {
  url: string;
  title: string;
  author: string;
  sourceUrl: string;
}

const commonsCache = new Map<string, CommonsImage[]>();
const commonsRequests = new Map<string, Promise<CommonsImage[]>>();

async function getCommonsImages(query: string): Promise<CommonsImage[]> {
  const cached = commonsCache.get(query);
  if (cached) return cached;
  const pending = commonsRequests.get(query);
  if (pending) return pending;

  const request = (async () => {
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: query,
      gsrnamespace: '6',
      gsrlimit: '6',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: '1100',
      format: 'json',
      origin: '*',
    });
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`);
    if (!response.ok) throw new Error('تعذر تحميل الصور');
    const payload = await response.json() as {
      query?: { pages?: Record<string, { title?: string; imageinfo?: Array<{ thumburl?: string; url?: string; descriptionurl?: string; extmetadata?: { Artist?: { value?: string } } }> }> };
    };
    const images = Object.values(payload.query?.pages ?? {}).flatMap((page) => {
      const info = page.imageinfo?.[0];
      const url = info?.thumburl ?? info?.url;
      if (!url) return [];
      const rawAuthor = info?.extmetadata?.Artist?.value ?? '';
      const author = rawAuthor.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().slice(0, 80);
      return [{
        url,
        title: page.title ?? 'Wikimedia Commons',
        author,
        sourceUrl: info?.descriptionurl ?? 'https://commons.wikimedia.org/',
      }];
    });
    commonsCache.set(query, images);
    return images;
  })();

  commonsRequests.set(query, request);
  try {
    return await request;
  } finally {
    commonsRequests.delete(query);
  }
}

export function WikimediaImage({
  query,
  height,
  index = 0,
  radius = 20,
}: {
  query: string;
  height: number;
  index?: number;
  radius?: number;
}) {
  const colors = useColors();
  const [image, setImage] = useState<CommonsImage | null>(() => commonsCache.get(query)?.[index] ?? null);
  const [loading, setLoading] = useState(!image);

  useEffect(() => {
    let active = true;
    setImage(commonsCache.get(query)?.[index] ?? null);
    setLoading(!commonsCache.get(query));
    getCommonsImages(query)
      .then((images) => {
        if (active) setImage(images[index] ?? images[0] ?? null);
      })
      .catch(() => {
        if (active) setImage(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [index, query]);

  return (
    <View style={[styles.imageFrame, { height, borderRadius: radius, backgroundColor: colors.muted }]}>
      {image ? (
        <>
          <Image source={{ uri: image.url }} contentFit="cover" style={StyleSheet.absoluteFill} />
          <Pressable
            accessibilityLabel="فتح مصدر الصورة في ويكيميديا كومنز"
            onPress={() => Linking.openURL(image.sourceUrl).catch(() => undefined)}
            style={[styles.credit, { backgroundColor: colors.foreground }]}
          >
            <Text numberOfLines={1} style={[styles.creditText, { color: colors.background }]}>
              ويكيميديا كومنز{image.author ? ` · ${image.author}` : ''}
            </Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.imageFallback}>
          {loading
            ? <ActivityIndicator color={colors.primary} />
            : <Ionicons name="image-outline" size={30} color={colors.mutedForeground} />}
          {!loading && <Text style={[styles.fallbackText, { color: colors.mutedForeground }]}>لا تتوفر صورة مطابقة الآن</Text>}
        </View>
      )}
    </View>
  );
}

const MAP_SHAPE = 'M72 34 L174 22 L267 43 L319 101 L309 176 L282 236 L270 313 L226 398 L174 471 L112 448 L72 395 L39 322 L48 259 L26 196 L42 133 L34 86 Z';

function pointFor(wilaya: Wilaya) {
  const x = 20 + ((wilaya.longitude + 8.7) / 12.1) * 300;
  const y = 22 + ((37.2 - wilaya.latitude) / 18.6) * 455;
  return { x, y };
}

export function AlgeriaMap({
  selectedId,
  onSelect,
  compact = false,
}: {
  selectedId?: string;
  onSelect: (wilaya: Wilaya) => void;
  compact?: boolean;
}) {
  const colors = useColors();
  const height = compact ? 190 : 460;
  const width = compact ? 300 : 360;
  const markerRadius = compact ? 4 : 5;

  return (
    <View style={[styles.mapWrap, { backgroundColor: colors.accent, height, borderRadius: compact ? 18 : 28 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 360 500">
        <Path d={MAP_SHAPE} fill={colors.primary} opacity={0.12} stroke={colors.primary} strokeWidth={3} />
        <Path d="M40 144 C95 121 147 126 198 106 C240 90 277 105 312 122" fill="none" stroke={colors.primary} strokeWidth={1.5} opacity={0.22} />
        {WILAYAS.map((wilaya) => {
          const { x, y } = pointFor(wilaya);
          const active = selectedId === wilaya.id;
          return (
            <Circle
              key={wilaya.id}
              cx={x}
              cy={y}
              r={active ? markerRadius + 3 : markerRadius}
              fill={active ? colors.destructive : colors.primary}
              stroke={colors.background}
              strokeWidth={active ? 2.5 : 1.5}
              onPress={() => onSelect(wilaya)}
            />
          );
        })}
      </Svg>
      <View pointerEvents="none" style={[styles.mapLabel, { backgroundColor: colors.card }]}>
        <Ionicons name="location" size={14} color={colors.primary} />
        <Text style={[styles.mapLabelText, { color: colors.foreground }]}>{compact ? 'موقع الولاية' : 'المس الولايات لاستكشافها'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageFrame: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  credit: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  creditText: { fontSize: 9, textAlign: 'left' },
  imageFallback: { alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  fallbackText: { fontSize: 11, textAlign: 'center' },
  mapWrap: { overflow: 'hidden', width: '100%', alignItems: 'center', justifyContent: 'center' },
  mapLabel: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
  },
  mapLabelText: { fontSize: 11, fontWeight: '600' },
});
