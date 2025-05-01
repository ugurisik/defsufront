import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Window = {
  id: string;
  title: string;
  content: React.ReactNode;
  isActive: boolean;
  isMinimized: boolean;
};

interface WindowState {
  windows: Window[];
  activeWindowId: string | null;
  
  // Pencere işlemleri
  openWindow: (window: Omit<Window, 'isActive' | 'isMinimized'>) => void;
  closeWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  hideAllWindow: () => void;
  closeAllWindow: () => void;
}

export const useWindowStore = create<WindowState>()(
  persist(
    (set, get) => ({
      windows: [],
      activeWindowId: null,

      openWindow: (windowData) => {
        const { windows } = get();
        const existingWindow = windows.find(w => w.id === windowData.id);

        if (existingWindow) {
          // Pencere zaten açıksa, aktif hale getir
          set({
            windows: windows.map(w => 
              w.id === windowData.id 
                ? { ...w, isActive: true, isMinimized: false } 
                : { ...w, isActive: false }
            ),
            activeWindowId: windowData.id
          });
        } else {
          // Yeni pencere aç
          const newWindow: Window = {
            ...windowData,
            isActive: true,
            isMinimized: false
          };

          set({
            windows: [...windows.map(w => ({ ...w, isActive: false })), newWindow],
            activeWindowId: newWindow.id
          });
        }
      },

      hideAllWindow: () => {
        const { windows } = get();
        set({
          windows: windows.map(w => ({ ...w, isActive: false, isMinimized: false })),
          activeWindowId: null
        });
      },

      closeAllWindow: () => {
        const { windows } = get();
        set({
          windows: [],
          activeWindowId: null
        });
      },

      closeWindow: (id) => {
        const { windows, activeWindowId } = get();
        const filteredWindows = windows.filter(w => w.id !== id);

        // Eğer kapatılan pencere aktif pencereyse, son pencereyi aktif yap
        let newActiveId = activeWindowId;
        if (id === activeWindowId && filteredWindows.length > 0) {
          newActiveId = filteredWindows[filteredWindows.length - 1].id;
          filteredWindows[filteredWindows.length - 1].isActive = true;
        } else if (filteredWindows.length === 0) {
          newActiveId = null;
        }

        set({
          windows: filteredWindows,
          activeWindowId: newActiveId
        });
      },

      setActiveWindow: (id) => {
        const { windows } = get();
        
        set({
          windows: windows.map(w => ({
            ...w,
            isActive: w.id === id,
            isMinimized: w.id === id ? false : w.isMinimized
          })),
          activeWindowId: id
        });
      },

      minimizeWindow: (id) => {
        const { windows, activeWindowId } = get();
        const updatedWindows = windows.map(w => 
          w.id === id ? { ...w, isMinimized: true, isActive: false } : w
        );

        // Eğer minimize edilen pencere aktif pencereyse, başka bir pencereyi aktif yap
        let newActiveId = activeWindowId;
        if (id === activeWindowId) {
          const availableWindows = updatedWindows.filter(w => !w.isMinimized);
          if (availableWindows.length > 0) {
            newActiveId = availableWindows[availableWindows.length - 1].id;
            updatedWindows.find(w => w.id === newActiveId)!.isActive = true;
          } else {
            newActiveId = null;
          }
        }

        set({
          windows: updatedWindows,
          activeWindowId: newActiveId
        });
      },

      maximizeWindow: (id) => {
        const { windows } = get();
        
        set({
          windows: windows.map(w => ({
            ...w,
            isActive: w.id === id,
            isMinimized: w.id === id ? false : w.isMinimized
          })),
          activeWindowId: id
        });
      }
    }),
    {
      name: 'window-storage',
      partialize: (state) => ({ 
        // Sadece pencere bilgilerini sakla, içerik React node olduğu için saklanamaz
        windows: state.windows.map(({ id, title, isMinimized }) => ({ 
          id, title, isMinimized 
        })) 
      }),
    }
  )
);
