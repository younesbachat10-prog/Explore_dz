import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'explore-dz-progress-v1';

interface SavedState {
  hasEntered: boolean;
  favoriteIds: string[];
  rewardedFavoriteIds: string[];
  visitedPlaceIds: string[];
  visitedWilayaIds: string[];
  claimedChallenges: string[];
  points: number;
}

interface ExploreContextValue extends SavedState {
  ready: boolean;
  enterAsGuest: () => void;
  visitPlace: (placeId: string, wilayaId: string) => void;
  toggleFavorite: (placeId: string) => void;
  claimChallenge: (id: string, reward: number, canClaim: boolean) => boolean;
}

const initialState: SavedState = {
  hasEntered: false,
  favoriteIds: [],
  rewardedFavoriteIds: [],
  visitedPlaceIds: [],
  visitedWilayaIds: [],
  claimedChallenges: [],
  points: 0,
};

const ExploreContext = createContext<ExploreContextValue | null>(null);

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SavedState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active) return;
        if (value) {
          const parsed = JSON.parse(value) as Partial<SavedState>;
          setState({
            ...initialState,
            ...parsed,
            favoriteIds: Array.isArray(parsed.favoriteIds) ? parsed.favoriteIds : [],
            rewardedFavoriteIds: Array.isArray(parsed.rewardedFavoriteIds) ? parsed.rewardedFavoriteIds : [],
            visitedPlaceIds: Array.isArray(parsed.visitedPlaceIds) ? parsed.visitedPlaceIds : [],
            visitedWilayaIds: Array.isArray(parsed.visitedWilayaIds) ? parsed.visitedWilayaIds : [],
            claimedChallenges: Array.isArray(parsed.claimedChallenges) ? parsed.claimedChallenges : [],
          });
        }
      })
      .catch(() => {
        // The app remains usable if local storage is unavailable.
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Keep the current session usable if persistence fails.
    });
  }, [ready, state]);

  const value = useMemo<ExploreContextValue>(() => ({
    ...state,
    ready,
    enterAsGuest: () => setState((current) => ({ ...current, hasEntered: true })),
    visitPlace: (placeId, wilayaId) => setState((current) => {
      const firstVisit = !current.visitedPlaceIds.includes(placeId);
      const firstWilaya = !current.visitedWilayaIds.includes(wilayaId);
      return {
        ...current,
        visitedPlaceIds: firstVisit ? [...current.visitedPlaceIds, placeId] : current.visitedPlaceIds,
        visitedWilayaIds: firstWilaya ? [...current.visitedWilayaIds, wilayaId] : current.visitedWilayaIds,
        points: current.points + (firstVisit ? 5 : 0) + (firstWilaya ? 5 : 0),
      };
    }),
    toggleFavorite: (placeId) => setState((current) => {
      const isFavorite = current.favoriteIds.includes(placeId);
      const wasRewarded = current.rewardedFavoriteIds.includes(placeId);
      return {
        ...current,
        favoriteIds: isFavorite
          ? current.favoriteIds.filter((id) => id !== placeId)
          : [...current.favoriteIds, placeId],
        rewardedFavoriteIds: !isFavorite && !wasRewarded
          ? [...current.rewardedFavoriteIds, placeId]
          : current.rewardedFavoriteIds,
        points: current.points + (!isFavorite && !wasRewarded ? 3 : 0),
      };
    }),
    claimChallenge: (id, reward, canClaim) => {
      if (!canClaim) return false;
      let awarded = false;
      setState((current) => {
        if (current.claimedChallenges.includes(id)) return current;
        awarded = true;
        return {
          ...current,
          claimedChallenges: [...current.claimedChallenges, id],
          points: current.points + reward,
        };
      });
      return awarded;
    },
  }), [ready, state]);

  return <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>;
}

export function useExplore(): ExploreContextValue {
  const value = useContext(ExploreContext);
  if (!value) throw new Error('useExplore must be used within ExploreProvider');
  return value;
}
