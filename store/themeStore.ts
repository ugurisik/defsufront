import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tema renk paletleri
export interface ThemePalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    primary_foreground: string;
    secondary: string;
    secondary_foreground: string;
    accent: string;
    accent_foreground: string;
    background: string;
    foreground: string;
    card: string;
    card_foreground: string;
    popover: string;
    popover_foreground: string;
    muted: string;
    muted_foreground: string;
    border: string;
    input: string;
    ring: string;
    destructive: string;
    destructive_foreground: string;
  };
}

// Tema paletleri
const themePalettes: ThemePalette[] = [
  {
    id: 'indigo-frost',
    name: 'Indigo Frost',
    colors: {
      primary: '#3730a3',
      primary_foreground: '#ffffff',
      secondary: '#6366f1',
      secondary_foreground: '#ffffff',
      accent: '#a5b4fc',
      accent_foreground: '#1e1b4b',
      background: '#f5f7ff',
      foreground: '#1e1b4b',
      card: '#ffffff',
      card_foreground: '#1e1b4b',
      popover: '#ffffff',
      popover_foreground: '#1e1b4b',
      muted: '#e0e7ff',
      muted_foreground: '#4338ca',
      border: '#c7d2fe',
      input: '#c7d2fe',
      ring: '#4f46e5',
      destructive: '#ef4444',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'emerald-breeze',
    name: 'Zümrüt Esinti',
    colors: {
      primary: '#065f46',
      primary_foreground: '#ffffff',
      secondary: '#10b981',
      secondary_foreground: '#ffffff',
      accent: '#6ee7b7',
      accent_foreground: '#064e3b',
      background: '#ecfdf5',
      foreground: '#064e3b',
      card: '#ffffff',
      card_foreground: '#064e3b',
      popover: '#ffffff',
      popover_foreground: '#064e3b',
      muted: '#d1fae5',
      muted_foreground: '#047857',
      border: '#a7f3d0',
      input: '#a7f3d0',
      ring: '#059669',
      destructive: '#f43f5e',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'ruby-elegance',
    name: 'Yakut Zarafeti',
    colors: {
      primary: '#9f1239',
      primary_foreground: '#ffffff',
      secondary: '#e11d48',
      secondary_foreground: '#ffffff',
      accent: '#fda4af',
      accent_foreground: '#881337',
      background: '#fff1f2',
      foreground: '#881337',
      card: '#ffffff',
      card_foreground: '#881337',
      popover: '#ffffff',
      popover_foreground: '#881337',
      muted: '#fecdd3',
      muted_foreground: '#be123c',
      border: '#fecdd3',
      input: '#fecdd3',
      ring: '#e11d48',
      destructive: '#7f1d1d',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'amber-gold',
    name: 'Amber Altın',
    colors: {
      primary: '#b45309',
      primary_foreground: '#ffffff',
      secondary: '#f59e0b',
      secondary_foreground: '#ffffff',
      accent: '#fcd34d',
      accent_foreground: '#78350f',
      background: '#fffbeb',
      foreground: '#78350f',
      card: '#ffffff',
      card_foreground: '#78350f',
      popover: '#ffffff',
      popover_foreground: '#78350f',
      muted: '#fef3c7',
      muted_foreground: '#d97706',
      border: '#fde68a',
      input: '#fde68a',
      ring: '#f59e0b',
      destructive: '#dc2626',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'violet-dream',
    name: 'Mor Rüya',
    colors: {
      primary: '#7e22ce',
      primary_foreground: '#ffffff',
      secondary: '#a855f7',
      secondary_foreground: '#ffffff',
      accent: '#d8b4fe',
      accent_foreground: '#581c87',
      background: '#f8f5ff',
      foreground: '#581c87',
      card: '#ffffff',
      card_foreground: '#581c87',
      popover: '#ffffff',
      popover_foreground: '#581c87',
      muted: '#f3e8ff',
      muted_foreground: '#9333ea',
      border: '#e9d5ff',
      input: '#e9d5ff',
      ring: '#a855f7',
      destructive: '#e11d48',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'ocean-depth',
    name: 'Okyanus Derinliği',
    colors: {
      primary: '#155e75',
      primary_foreground: '#ffffff',
      secondary: '#0ea5e9',
      secondary_foreground: '#ffffff',
      accent: '#7dd3fc',
      accent_foreground: '#0c4a6e',
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      card: '#ffffff',
      card_foreground: '#0c4a6e',
      popover: '#ffffff',
      popover_foreground: '#0c4a6e',
      muted: '#e0f2fe',
      muted_foreground: '#0284c7',
      border: '#bae6fd',
      input: '#bae6fd',
      ring: '#0ea5e9',
      destructive: '#dc2626',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'forest-shadow',
    name: 'Orman Gölgesi',
    colors: {
      primary: '#14532d',
      primary_foreground: '#ffffff',
      secondary: '#15803d',
      secondary_foreground: '#ffffff',
      accent: '#86efac',
      accent_foreground: '#052e16',
      background: '#f0fdf4',
      foreground: '#052e16',
      card: '#ffffff',
      card_foreground: '#052e16',
      popover: '#ffffff',
      popover_foreground: '#052e16',
      muted: '#dcfce7',
      muted_foreground: '#16a34a',
      border: '#bbf7d0',
      input: '#bbf7d0',
      ring: '#15803d',
      destructive: '#b91c1c',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'rose-petal',
    name: 'Gül Yaprağı',
    colors: {
      primary: '#9d174d',
      primary_foreground: '#ffffff',
      secondary: '#db2777',
      secondary_foreground: '#ffffff',
      accent: '#fbcfe8',
      accent_foreground: '#831843',
      background: '#fdf2f8',
      foreground: '#831843',
      card: '#ffffff',
      card_foreground: '#831843',
      popover: '#ffffff',
      popover_foreground: '#831843',
      muted: '#fce7f3',
      muted_foreground: '#be185d',
      border: '#f9a8d4',
      input: '#f9a8d4',
      ring: '#db2777',
      destructive: '#b91c1c',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'slate-modern',
    name: 'Modern Arduvaz',
    colors: {
      primary: '#334155',
      primary_foreground: '#ffffff',
      secondary: '#64748b',
      secondary_foreground: '#ffffff',
      accent: '#cbd5e1',
      accent_foreground: '#1e293b',
      background: '#f8fafc',
      foreground: '#1e293b',
      card: '#ffffff',
      card_foreground: '#1e293b',
      popover: '#ffffff',
      popover_foreground: '#1e293b',
      muted: '#f1f5f9',
      muted_foreground: '#64748b',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#64748b',
      destructive: '#ef4444',
      destructive_foreground: '#ffffff',
    },
  },
  {
    id: 'midnight-berry',
    name: 'Gece Yemişi',
    colors: {
      primary: '#581c87',
      primary_foreground: '#ffffff',
      secondary: '#9333ea',
      secondary_foreground: '#ffffff',
      accent: '#c084fc',
      accent_foreground: '#3b0764',
      background: '#faf5ff',
      foreground: '#3b0764',
      card: '#ffffff',
      card_foreground: '#3b0764',
      popover: '#ffffff',
      popover_foreground: '#3b0764',
      muted: '#f3e8ff',
      muted_foreground: '#9333ea',
      border: '#e9d5ff',
      input: '#e9d5ff',
      ring: '#9333ea',
      destructive: '#e11d48',
      destructive_foreground: '#ffffff',
    },
  },
];

// Tema store türü
interface ThemeState {
  currentPaletteId: string;
  availablePalettes: ThemePalette[];
  setPalette: (paletteId: string) => void;
  getCurrentPalette: () => ThemePalette;
}

// Tema store'u
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentPaletteId: 'indigo-frost', // Varsayılan tema
      availablePalettes: themePalettes,
      
      setPalette: (paletteId: string) => set({ currentPaletteId: paletteId }),
      
      getCurrentPalette: () => {
        const { currentPaletteId, availablePalettes } = get();
        return availablePalettes.find(p => p.id === currentPaletteId) || availablePalettes[0];
      },
    }),
    {
      name: 'defsu-theme-storage',
    }
  )
);