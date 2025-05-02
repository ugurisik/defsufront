"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useModalStore } from "@/store/modalStore";
import { InvoiceSelectModal } from "./InvoiceSelectModal";
import { RevenueProcessModal } from "./RevenueProcessModal";
import { toast } from "sonner";

export const TestModals = () => {
  const { openModal } = useModalStore();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  
  // Fatura seçim modalını aç
  const handleOpenInvoiceModal = () => {
    openModal({
      id: "invoice-select",
      component: InvoiceSelectModal,
      props: {
        title: "Geçmiş Faturalardan Aktar",
        customerId: "CUST-001" // Örnek müşteri ID'si
      },
      isResizable: true,
      size: { width: 800, height: 600 },
      
      onClose: (result) => {
        if (result) {
          setSelectedInvoice(result);
          toast.success("Fatura başarıyla aktarıldı!");
        }
      }
    });
  };
  
  // Gelir işleme modalını aç
  const handleOpenRevenueModal = () => {
    openModal({
      id: "revenue-process",
      component: RevenueProcessModal,
      props: {
        title: "Yeni Gelir Ekle"
      },
      isResizable: true,
      position: { x: 200, y: 150 },
      size: { width: 500, height: 650 },
      onClose: (result) => {
        if (result) {
          setRevenueData(result);
          toast.success("Gelir başarıyla kaydedildi!");
        }
      }
    });
  };
  
  // Gelir düzenleme modalını aç
  const handleEditRevenueModal = () => {
    if (!revenueData) {
      toast.error("Düzenlenecek gelir verisi bulunamadı!");
      return;
    }
    
    openModal({
      id: "revenue-edit",
      component: RevenueProcessModal,
      props: {
        title: "Gelir Düzenle",
        initialData: revenueData
      },
      isResizable: true,
      position: { x: 250, y: 200 },
      size: { width: 500, height: 650 },
      onClose: (result) => {
        if (result) {
          setRevenueData(result);
          toast.success("Gelir başarıyla güncellendi!");
        }
      }
    });
  };
  
  return (
    <div className="container mx-auto p-6 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Modal Sistemi Test</CardTitle>
          <CardDescription>
            Sürüklenebilir ve boyutlandırılabilir modal pencerelerini test etmek için aşağıdaki butonları kullanabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Fatura Aktarma Örneği</h3>
            <div className="flex space-x-4">
              <Button onClick={handleOpenInvoiceModal}>
                Fatura Seçim Modalını Aç
              </Button>
            </div>
            
            {selectedInvoice && (
              <div className="p-4 border rounded-md bg-muted">
                <h4 className="font-medium mb-2">Seçilen Fatura:</h4>
                <pre className="text-sm overflow-auto p-2 bg-card rounded">
                  {JSON.stringify(selectedInvoice, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Gelir İşleme Örneği</h3>
            <div className="flex space-x-4">
              <Button onClick={handleOpenRevenueModal}>
                Yeni Gelir Ekle
              </Button>
              <Button 
                variant="outline" 
                onClick={handleEditRevenueModal}
                disabled={!revenueData}
              >
                Geliri Düzenle
              </Button>
            </div>
            
            {revenueData && (
              <div className="p-4 border rounded-md bg-muted">
                <h4 className="font-medium mb-2">Gelir Verisi:</h4>
                <pre className="text-sm overflow-auto p-2 bg-card rounded">
                  {JSON.stringify(revenueData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
