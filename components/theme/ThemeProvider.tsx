"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useThemeStore, ThemePalette } from "@/store/themeStore";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  palette: ThemePalette;
  setPaletteById: (id: string) => void;
  availablePalettes: ThemePalette[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeStore = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Tema paleti
  const [currentPalette, setCurrentPalette] = useState<ThemePalette>(themeStore.getCurrentPalette());

  // Tema paletini ayarla
  const setPaletteById = (id: string) => {
    themeStore.setPalette(id);
    setCurrentPalette(themeStore.getCurrentPalette());
    updateThemeColors(themeStore.getCurrentPalette());
  };

  // Tema renklerini güncelle
  const updateThemeColors = (palette: ThemePalette) => {
    // Özel CSS değişkenlerini ayarla
    document.documentElement.style.setProperty('--color-primary', palette.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', palette.colors.secondary);
    document.documentElement.style.setProperty('--color-accent', palette.colors.accent);
    document.documentElement.style.setProperty('--color-background', palette.colors.background);
    
    // Shadcn UI değişkenlerini güncelle
    document.documentElement.style.setProperty('--primary', palette.colors.primary);
    document.documentElement.style.setProperty('--primary-foreground', palette.colors.primary_foreground);
    document.documentElement.style.setProperty('--secondary', palette.colors.secondary);
    document.documentElement.style.setProperty('--secondary-foreground', palette.colors.secondary_foreground);
    document.documentElement.style.setProperty('--accent', palette.colors.accent);
    document.documentElement.style.setProperty('--accent-foreground', palette.colors.accent_foreground);
    document.documentElement.style.setProperty('--background', palette.colors.background);
    document.documentElement.style.setProperty('--foreground', palette.colors.foreground);
    
    // Kart ve diğer bileşen renklerini ayarla
    document.documentElement.style.setProperty('--card', palette.colors.card);
    document.documentElement.style.setProperty('--card-foreground', palette.colors.card_foreground);
    document.documentElement.style.setProperty('--popover', palette.colors.popover);
    document.documentElement.style.setProperty('--popover-foreground', palette.colors.popover_foreground);
    document.documentElement.style.setProperty('--muted', palette.colors.muted);
    document.documentElement.style.setProperty('--muted-foreground', palette.colors.muted_foreground);
    document.documentElement.style.setProperty('--border', palette.colors.border);
    document.documentElement.style.setProperty('--input', palette.colors.input);
    document.documentElement.style.setProperty('--ring', palette.colors.ring);
    document.documentElement.style.setProperty('--destructive', palette.colors.destructive);
    document.documentElement.style.setProperty('--destructive-foreground', palette.colors.destructive_foreground);
  };

  // İlk yükleme
  useEffect(() => {
    setMounted(true);
    updateThemeColors(themeStore.getCurrentPalette());
  }, []);

  // Hidrasyon sorunlarını önlemek için
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        palette: currentPalette,
        setPaletteById,
        availablePalettes: themeStore.availablePalettes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};