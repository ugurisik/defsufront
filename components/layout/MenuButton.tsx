"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Star, AlertCircle } from "lucide-react";
import { MenuPanel } from "@/components/layout/MenuPanel";
import { useShortcutStore, Shortcut } from "@/store/shortcutStore";
import { useWindowStore } from "@/store/windowStore";
import { toast } from "sonner";
import { findMenuItemById } from "@/config/menuConfig";
import { motion, AnimatePresence } from "framer-motion";

export const MenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const { shortcuts } = useShortcutStore();
  const { openWindow } = useWindowStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Sağ tıklama menüsü açıksa kapat
    if (isContextMenuOpen) {
      setIsContextMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };
  
  // Sağ tıklama menüsünü aç
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Menü açıksa kapat
    if (isOpen) {
      setIsOpen(false);
    }
    
    // Sağ tıklama menüsü pozisyonunu ayarla
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setIsContextMenuOpen(true);
  };
  
  // Kısayola tıklandığında pencere aç
  const handleShortcutClick = (shortcut: Shortcut) => {
    // menuConfig'den menü öğesini bul
    const menuItem = findMenuItemById(shortcut.id);
    
    if (menuItem) {
      // Menü öğesi varsa, özel durumları kontrol et
      if (shortcut.id === 'logout') {
        // Çıkış işlemi
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        toast.success("Çıkış yapıldı");
        window.location.href = "/auth/login";
      } else {
        // İçerik oluştur
        let content;
        
        if (menuItem.component) {
          // Doğrudan bileşeni kullan
          content = <menuItem.component onClose={() => useWindowStore.getState().closeWindow(shortcut.id)} />;
        } else if (menuItem.componentName) {
          // componentName mevcut ama component değil - varsayılan içerik göster
          content = <div className="p-4">{menuItem.title} içeriği burada olacak</div>;
        } else {
          // Hem component hem componentName yoksa varsayılan içerik
          content = <div className="p-4">{menuItem.title} içeriği burada olacak</div>;
        }
        
        // Pencereyi aç
        openWindow({
          id: shortcut.id,
          title: menuItem.title,
          content
        });
      }
    } else {
      // Menü öğesi bulunamadıysa uyarı göster
      toast.error("Bu kısayol için geçerli bir menü öğesi bulunamadı!", {
        description: "Kısayol ID: " + shortcut.id,
        icon: <AlertCircle className="h-5 w-5" />
      });
    }
    
    closeContextMenu();
  };

  // Menü dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Sağ tıklama menüsü dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ESC tuşuna basıldığında menüyü kapat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpen) closeMenu();
        if (isContextMenuOpen) closeContextMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isContextMenuOpen]);

  // Animasyon varyantları
  const menuVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 10
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 350, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Menü öğeleri için staggered animasyon
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  return (
    <>
      <div ref={menuRef} className="relative" onContextMenu={handleContextMenu}>
        <Button
          onClick={toggleMenu}
          variant="default"
          size="lg"
          className="rounded-md h-10 w-15 shadow-lg hover:cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </Button>
        {isOpen && <MenuPanel onClose={closeMenu} />}
      </div>
      
      {/* Animasyonlu Sağ Tıklama Menüsü */}
      <AnimatePresence>
        {isContextMenuOpen && (
          <motion.div 
            ref={contextMenuRef}
            className="fixed bg-background border rounded-md shadow-md p-2 min-w-48 max-w-[200px] z-[1001]"
            style={{ 
              top: `${contextMenuPosition.y - 300}px`, 
              left: `${contextMenuPosition.x}px`,
              bottom: "10px",
              maxHeight: "300px",
              overflowY: "auto"
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="py-1 px-2 text-sm font-medium text-muted-foreground mb-2 border-b pb-1 flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" /> Kısayollar
            </div>
            
            {shortcuts.length > 0 ? (
              <div className="space-y-1">
                {shortcuts.map((shortcut, index) => (
                  <motion.button
                    key={shortcut.id}
                    type="button"
                    className="w-full text-left p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-all hover:shadow-sm"
                    onClick={() => handleShortcutClick(shortcut)}
                    variants={itemVariants}
                    custom={index} // Sıralı animasyon için index değerini iletiyoruz
                    initial="hidden"
                    animate="visible"
                  >
                    <span>{shortcut.title}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div 
                className="py-2 px-1 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Henüz kısayol eklenmemiş
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};