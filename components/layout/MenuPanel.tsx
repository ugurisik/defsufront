"use client";

import { useState, useRef } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWindowStore } from "@/store/windowStore";
import { leftMenuItems, rightMenuItems, MenuItem } from "@/config/menuConfig";
import { motion, AnimatePresence } from "framer-motion";

interface MenuPanelProps {
  onClose: () => void;
}

export const MenuPanel = ({ onClose }: MenuPanelProps) => {
  const router = useRouter();
  const { openWindow } = useWindowStore();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{top: number, left: number} | null>(null);
  const [subMenuPosition, setSubMenuPosition] = useState<{top: number, left: number} | null>(null);
  
  // Referanslar
  const menuItemRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});
  const subMenuItemRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});
  const mainPanelRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    toast.success("Çıkış yapıldı");
    router.push("/auth/login");
  };

  const handleOpenWindow = (item: MenuItem) => {
    console.log("Pencere açılıyor:", item.id, item.title);
    
    // Özel durumlar için kontrol
    if (item.id === "logout") {
      handleLogout();
      return;
    }

    // Menü öğesinden bileşeni al
    let content;
    
    if (item.component) {
      // Doğrudan bileşeni kullan
      content = <item.component onClose={() => useWindowStore.getState().closeWindow(item.id)} />;
    } else if (item.componentName) {
      // componentName mevcut ama component değil - varsayılan içerik göster
      content = <div className="p-4">{item.title} içeriği burada olacak</div>;
    } else {
      // Hem component hem componentName yoksa varsayılan içerik
      content = <div className="p-4">{item.title} içeriği burada olacak</div>;
    }
    
    openWindow({
      id: item.id,
      title: item.title,
      content,
    });
    
    onClose();
  };

  // Bir menü öğesini ID'ye göre bul
  const findMenuItemById = (id: string): MenuItem | undefined => {
    // Sol menüde ara
    const result = findItemInMenuArray(leftMenuItems, id);
    if (result) return result;
    
    // Sağ menüde ara
    return findItemInMenuArray(rightMenuItems, id);
  };
  
  // Menü dizisinde öğe ara (recursive)
  const findItemInMenuArray = (items: MenuItem[], id: string): MenuItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      
      if (item.children?.length) {
        const found = findItemInMenuArray(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Açık alt menüleri kapat
  const closeOpenedSubMenus = (e?: React.MouseEvent) => {
    // Eğer bir olay varsa ve isMenuItemClick fonksiyonu true dönüyorsa
    // (yani tıklama bir menü öğesine yapılmışsa) hiçbir şey yapma
    if (e && isMenuItemClick(e)) {
      return;
    }
    
    // Alt menüleri kapat
    setExpandedMenu(null);
    setExpandedSubMenu(null);
  };
  
  // Tıklamanın bir menü öğesine yapılıp yapılmadığını kontrol et
  const isMenuItemClick = (e: React.MouseEvent): boolean => {
    // Tıklanan element
    const target = e.target as HTMLElement;
    
    // Eğer tıklanan element veya üst elementlerinden biri menü öğesi ise true döndür
    // Burada menü öğelerinin classları ile kontrol yapıyoruz
    const isMenuButton = target.closest('button');
    return !!isMenuButton;
  };

  // Menü öğesini render et (StopPropagation eklendi)
  const renderMenuItem = (item: MenuItem, index: number) => {
    const isExpanded = expandedMenu === item.id;
    const hasChildren = item.children && item.children.length > 0;
    
    const handleClick = (e: React.MouseEvent) => {
      // Event'in yukarı doğru yayılmasını engelle
      e.stopPropagation();
      
      console.log("Menü öğesine tıklandı:", item.title);
      
      if (hasChildren) {
        // Alt menüsü varsa aç/kapat
        if (isExpanded) {
          setExpandedMenu(null);
        } else {
          setExpandedMenu(item.id);
          setExpandedSubMenu(null); // Alt menü açıldığında iç içe menüyü kapat
          
          // Menü pozisyonunu hesapla
          if (menuItemRefs.current[item.id]) {
            const rect = menuItemRefs.current[item.id]!.getBoundingClientRect();
            setMenuPosition({
              top: rect.bottom,
              left: rect.left
            });
          }
        }
      } else {
        // Alt menüsü yoksa pencere aç veya ilgili işlemi yap
        handleOpenWindow(item);
      }
    };

    return (
      <motion.div 
        key={item.id} 
        className="relative"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.05 * index }}
      >
        <button
          ref={(el) => { menuItemRefs.current[item.id] = el; }}
          type="button"
          className="flex w-full items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer hover:cursor-pointer text-left transition-all hover:shadow-sm"
          onClick={handleClick}
        >
          {item.icon && <span>{item.icon}</span>}
          <span>{item.title}</span>
          {item.children && item.children.length > 0 && (
            <span className="ml-auto">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          )}
        </button>
      </motion.div>
    );
  };
  
  // Alt menü öğesini render et (StopPropagation eklendi)
  const renderSubMenuItem = (subItem: MenuItem, index: number) => {
    const isExpanded = expandedSubMenu === subItem.id;
    const hasChildren = subItem.children && subItem.children.length > 0;
    
    const handleClick = (e: React.MouseEvent) => {
      // Event'in yukarı doğru yayılmasını engelle
      e.stopPropagation();
      
      console.log("Alt menü öğesine tıklandı:", subItem.title);
      
      if (hasChildren) {
        // İç içe alt menüsü varsa aç/kapat
        if (isExpanded) {
          setExpandedSubMenu(null);
        } else {
          setExpandedSubMenu(subItem.id);
          
          // Alt menü pozisyonunu hesapla
          if (subMenuItemRefs.current[subItem.id]) {
            const rect = subMenuItemRefs.current[subItem.id]!.getBoundingClientRect();
            setSubMenuPosition({
              top: rect.top,
              left: rect.right + 5
            });
          }
        }
      } else {
        // İç içe alt menüsü yoksa pencere aç veya ilgili işlemi yap
        handleOpenWindow(subItem);
      }
    };

    return (
      <motion.div 
        key={subItem.id} 
        className="relative"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.05 * index }}
      >
        <button
          ref={(el) => { subMenuItemRefs.current[subItem.id] = el; }}
          type="button"
          className="flex w-full items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer hover:cursor-pointer text-left transition-all hover:shadow-sm"
          onClick={handleClick}
        >
          <span>{subItem.title}</span>
          {hasChildren && (
            <span className="ml-auto">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          )}
        </button>
      </motion.div>
    );
  };

  // İç içe alt menü öğesini render et (StopPropagation eklendi)
  const renderInnerMenuItem = (innerItem: MenuItem, index: number) => {
    const handleClick = (e: React.MouseEvent) => {
      // Event'in yukarı doğru yayılmasını engelle
      e.stopPropagation();
      
      console.log("İç içe alt menü öğesine tıklandı:", innerItem.title);
      handleOpenWindow(innerItem);
      setExpandedMenu(null);
      setExpandedSubMenu(null);
    };
    
    return (
      <motion.button
        key={innerItem.id}
        type="button"
        className="w-full text-left p-2 rounded-md hover:bg-secondary/50 cursor-pointer hover:cursor-pointer transition-all hover:shadow-sm"
        onClick={handleClick}
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.05 * index }}
      >
        <span>{innerItem.title}</span>
      </motion.button>
    );
  };

  // Ana panel animasyon varyantları
  const panelVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // Alt menü animasyon varyantları
  const submenuVariants = {
    hidden: { opacity: 0, scale: 0.85, y: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.85, 
      y: -5,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div 
          ref={mainPanelRef}
          className="absolute bottom-13 left-0 bg-background border rounded-lg shadow-lg w-[400px] h-[400px] z-50 flex"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          onClick={closeOpenedSubMenus}
        >
          {/* Sol kısım - Dinamik menüler */}
          <div className="w-1/2 border-r p-2 overflow-y-auto">
            <h3 className="font-medium text-sm text-muted-foreground mb-2 px-2">Menü</h3>
            <div className="space-y-1">
              {leftMenuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          </div>

          {/* Sağ kısım - Sabit menüler */}
          <div className="w-1/2 p-2 overflow-y-auto">
            <h3 className="font-medium text-sm text-muted-foreground mb-2 px-2">Ayarlar</h3>
            <div className="space-y-1">
              {rightMenuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Alt menü popup - stopPropagation eklendi */}
      <AnimatePresence>
        {expandedMenu && menuPosition && (
          <motion.div 
            className="fixed bg-background border rounded-md shadow-md p-2 min-w-48 z-[1000]"
            style={{ 
              top: `${menuPosition.top}px`, 
              left: `${menuPosition.left}px`,
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={submenuVariants}
            data-submenu="true"
            onClick={(e) => e.stopPropagation()} // Tıklamanın ana panele ulaşmasını engelle
          >
            {findMenuItemById(expandedMenu)?.children?.map((subItem, index) => renderSubMenuItem(subItem, index))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* İç içe alt menü popup - stopPropagation eklendi */}
      <AnimatePresence>
        {expandedSubMenu && subMenuPosition && (
          <motion.div 
            className="fixed bg-background border rounded-md shadow-md p-2 min-w-48 z-[1001]"
            style={{ 
              top: `${subMenuPosition.top}px`, 
              left: `${subMenuPosition.left}px`,
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={submenuVariants}
            data-innersubmenu="true"
            onClick={(e) => e.stopPropagation()} // Tıklamanın ana panele ulaşmasını engelle
          >
            {findMenuItemById(expandedSubMenu)?.children?.map((innerItem, index) => renderInnerMenuItem(innerItem, index))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};