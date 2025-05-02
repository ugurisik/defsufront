import { create } from 'zustand';

// Modal tipi
export type ModalData = {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
  onClose?: (result?: any) => void;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  isResizable?: boolean;
};

// Modal durumu
type ModalState = {
  modals: Record<string, ModalData & { isOpen: boolean }>;
  
  // Modal açma
  openModal: (modalData: ModalData) => void;
  
  // Modal kapatma
  closeModal: (id: string, result?: any) => void;
  
  // Modal pozisyonunu güncelleme
  updateModalPosition: (id: string, position: { x: number; y: number }) => void;
  
  // Modal boyutunu güncelleme
  updateModalSize: (id: string, size: { width: number; height: number }) => void;
};

// Modal store
export const useModalStore = create<ModalState>((set, get) => ({
  modals: {},
  
  // Modal açma
  openModal: (modalData) => {
    const { modals } = get();
    
    // Varsayılan pozisyon (ekranın ortası)
    const defaultPosition = {
      x: typeof window !== 'undefined' 
        ? (window.innerWidth - (modalData.size?.width || 600)) / 2 
        : 100,
      y: typeof window !== 'undefined' 
        ? (window.innerHeight - (modalData.size?.height || 400)) / 2 
        : 100
    };
    
    // Varsayılan boyut
    const defaultSize = {
      width: 600,
      height: 400
    };
    
    set({
      modals: {
        ...modals,
        [modalData.id]: {
          ...modalData,
          position: modalData.position || defaultPosition,
          size: modalData.size || defaultSize,
          isResizable: modalData.isResizable !== undefined ? modalData.isResizable : true,
          isOpen: true
        }
      }
    });
  },
  
  // Modal kapatma
  closeModal: (id, result) => {
    const { modals } = get();
    const modal = modals[id];
    
    if (modal) {
      // onClose callback'i çağır
      if (modal.onClose) {
        modal.onClose(result);
      }
      
      // Modal'ı kaldır
      const newModals = { ...modals };
      delete newModals[id];
      
      set({ modals: newModals });
    }
  },
  
  // Modal pozisyonunu güncelleme
  updateModalPosition: (id, position) => {
    const { modals } = get();
    const modal = modals[id];
    
    if (modal) {
      set({
        modals: {
          ...modals,
          [id]: {
            ...modal,
            position
          }
        }
      });
    }
  },
  
  // Modal boyutunu güncelleme
  updateModalSize: (id, size) => {
    const { modals } = get();
    const modal = modals[id];
    
    if (modal) {
      set({
        modals: {
          ...modals,
          [id]: {
            ...modal,
            size
          }
        }
      });
    }
  }
}));
