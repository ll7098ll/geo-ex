import { useState, useEffect, useCallback } from 'react';
import { PlaceInfo } from '../types';

const SPECIMENS_STORAGE_KEY = 'geo_specimens_v1';

export function useSpecimenBag() {
  const [specimens, setSpecimens] = useState<PlaceInfo[]>(() => {
    try {
      const saved = localStorage.getItem(SPECIMENS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SPECIMENS_STORAGE_KEY, JSON.stringify(specimens));
    } catch {
      // storage unavailable
    }
  }, [specimens]);

  const toggleSpecimen = useCallback((place: PlaceInfo) => {
    setSpecimens((prev) => {
      const exists = prev.some((p) => p.placeName === place.placeName);
      return exists
        ? prev.filter((p) => p.placeName !== place.placeName)
        : [place, ...prev];
    });
  }, []);

  const removeSpecimen = useCallback((placeName: string) => {
    setSpecimens((prev) => prev.filter((p) => p.placeName !== placeName));
  }, []);

  const clearSpecimens = useCallback(() => {
    setSpecimens([]);
  }, []);

  return {
    specimens,
    toggleSpecimen,
    removeSpecimen,
    clearSpecimens,
  };
}
