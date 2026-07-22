import { create } from "zustand";

export type PropertyType = "apartment" | "house" | "villa" | "studio" | "commercial" | null;

interface FilterStore {
  search: string;
  propertyType: PropertyType;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (value: string) => void;
  setPropertyType: (value: PropertyType) => void;
  setBedrooms: (value: number | null) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  search: "",
  propertyType: null,
  bedrooms: null,
  minPrice: null,
  maxPrice: null,

  setSearch: (value: string) => set({ search: value }),
  setPropertyType: (value: PropertyType) => set({ propertyType: value }),
  setBedrooms: (value: number | null) => set({ bedrooms: value }),
  setMinPrice: (value: number | null) => set({ minPrice: value }),
  setMaxPrice: (value: number | null) => set({ maxPrice: value }),
  resetFilters: () =>
    set({
      search: "",
      propertyType: null,
      bedrooms: null,
      minPrice: null,
      maxPrice: null,
    }),
}));
