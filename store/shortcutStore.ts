import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Shortcut {
  id: string;
  title: string;
}

interface ShortcutState {
  shortcuts: Shortcut[];
  addShortcut: (shortcut: Shortcut) => void;
  removeShortcut: (id: string) => void;
  hasShortcut: (id: string) => boolean;
  toggleShortcut: (shortcut: Shortcut) => void;
}

export const useShortcutStore = create<ShortcutState>()(
  persist(
    (set, get) => ({
      shortcuts: [],
      
      addShortcut: (shortcut) => {
        const { shortcuts } = get();
        
        // Aynı ID'ye sahip kısayol var mı kontrol et
        if (!shortcuts.some(s => s.id === shortcut.id)) {
          set({ shortcuts: [...shortcuts, shortcut] });
        }
      },
      
      removeShortcut: (id) => {
        const { shortcuts } = get();
        set({ shortcuts: shortcuts.filter(s => s.id !== id) });
      },
      
      hasShortcut: (id) => {
        const { shortcuts } = get();
        return shortcuts.some(s => s.id === id);
      },
      
      toggleShortcut: (shortcut) => {
        const { shortcuts, hasShortcut, addShortcut, removeShortcut } = get();
        
        if (hasShortcut(shortcut.id)) {
          removeShortcut(shortcut.id);
        } else {
          addShortcut(shortcut);
        }
      },
    }),
    {
      name: 'shortcut-storage',
    }
  )
);
