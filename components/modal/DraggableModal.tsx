"use client";

import { useRef, useState, useEffect } from "react";
import { X, Maximize2, Grip } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import { Button } from "@/components/ui/button";

interface DraggableModalProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  onClose?: (result?: any) => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  isResizable?: boolean;
  className?: string;
}

export const DraggableModal = ({
  id,
  title = "Modal",
  children,
  onClose,
  initialPosition,
  initialSize,
  isResizable = true,
  className = "",
}: DraggableModalProps) => {
  const { updateModalPosition, updateModalSize, closeModal } = useModalStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  
  // Sürükleme durumu
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Boyutlandırma durumu
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialModalSize, setInitialModalSize] = useState({ width: 0, height: 0 });
  
  // Modal'ı kapat
  const handleClose = (result?: any) => {
    if (onClose) {
      onClose(result);
    }
    closeModal(id, result);
  };
  
  // Sürükleme işlemi başladığında
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    e.preventDefault();
    
    const modalElement = modalRef.current;
    if (!modalElement) return;
    
    const rect = modalElement.getBoundingClientRect();
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // Boyutlandırma işlemi başladığında
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const modalElement = modalRef.current;
    if (!modalElement) return;
    
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY
    });
    setInitialModalSize({
      width: modalElement.offsetWidth,
      height: modalElement.offsetHeight
    });
  };
  
  // Sürükleme ve boyutlandırma işlemleri
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Sürükleme işlemi
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        
        // Ekran sınırlarını kontrol et
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const modalElement = modalRef.current;
        
        if (modalElement) {
          const modalWidth = modalElement.offsetWidth;
          const modalHeight = modalElement.offsetHeight;
          
          // Modal'ın ekrandan tamamen çıkmasını engelle
          if (newPosition.x < -modalWidth + 100) newPosition.x = -modalWidth + 100;
          if (newPosition.y < 0) newPosition.y = 0;
          if (newPosition.x > screenWidth - 100) newPosition.x = screenWidth - 100;
          if (newPosition.y > screenHeight - 50) newPosition.y = screenHeight - 50;
          
          updateModalPosition(id, newPosition);
        }
      }
      
      // Boyutlandırma işlemi
      if (isResizing && isResizable) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newSize = {
          width: Math.max(300, initialModalSize.width + deltaX),
          height: Math.max(200, initialModalSize.height + deltaY)
        };
        
        updateModalSize(id, newSize);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    id, 
    isDragging, 
    isResizing, 
    dragOffset, 
    resizeStart, 
    initialModalSize, 
    updateModalPosition, 
    updateModalSize,
    isResizable
  ]);
  
  // Modal'ı ekranın ortasına yerleştir
  const handleCenter = () => {
    const modalElement = modalRef.current;
    if (!modalElement) return;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const modalWidth = modalElement.offsetWidth;
    const modalHeight = modalElement.offsetHeight;
    
    updateModalPosition(id, {
      x: (screenWidth - modalWidth) / 2,
      y: (screenHeight - modalHeight) / 2
    });
  };
  
  return (
    <div
      ref={modalRef}
      className={`fixed bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 ${className}`}
      style={{
        left: `${initialPosition?.x || 0}px`,
        top: `${initialPosition?.y || 0}px`,
        width: `${initialSize?.width || 600}px`,
        height: `${initialSize?.height || 400}px`
      }}
    >
      {/* Modal Başlığı */}
      <div
        ref={headerRef}
        className={`flex items-center justify-between p-3 bg-gradient-to-b from-secondary/30 to-secondary/10 cursor-move ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-2">
          <Grip className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium truncate max-w-[400px]">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary"
            onClick={handleCenter}
            title="Ortala"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600"
            onClick={() => handleClose()}
            title="Kapat"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Modal İçeriği */}
      <div className="flex flex-col overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
        {children}
      </div>
      
      {/* Boyutlandırma Tutamacı */}
      {isResizable && (
        <div
          ref={resizeHandleRef}
          className={`absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize ${isResizing ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleResizeStart}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-1 right-1 text-muted-foreground/60"
          >
            <path
              d="M22 22L16 16M22 16L16 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
