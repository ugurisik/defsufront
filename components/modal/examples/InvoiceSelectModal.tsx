"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar, FileText } from "lucide-react";

// Fatura tipi
interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  total: number;
}

interface InvoiceSelectModalProps {
  customerId?: string; // Seçili müşteri ID'si (opsiyonel)
  title?: string;
  onClose: (selectedInvoice?: Invoice) => void;
}

export const InvoiceSelectModal = ({
  customerId,
  title = "Geçmiş Faturalardan Aktar",
  onClose
}: InvoiceSelectModalProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Fatura verilerini yükle (simüle edilmiş)
  useEffect(() => {
    // Gerçek uygulamada burada API çağrısı yapılacak
    const fetchInvoices = async () => {
      setLoading(true);
      
      try {
        // Simüle edilmiş veri
        // Gerçek uygulamada: const response = await fetch(`/api/invoices?customerId=${customerId}`);
        
        // Simüle edilmiş gecikme
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const dummyInvoices: Invoice[] = [
          {
            id: "INV-001",
            invoiceNumber: "F-2025-0001",
            date: "2025-04-15",
            customerName: "ABC Ltd. Şti.",
            total: 1250.75
          },
          {
            id: "INV-002",
            invoiceNumber: "F-2025-0002",
            date: "2025-04-18",
            customerName: "ABC Ltd. Şti.",
            total: 875.50
          },
          {
            id: "INV-003",
            invoiceNumber: "F-2025-0003",
            date: "2025-04-22",
            customerName: "ABC Ltd. Şti.",
            total: 3120.00
          },
          {
            id: "INV-004",
            invoiceNumber: "F-2025-0004",
            date: "2025-04-25",
            customerName: "ABC Ltd. Şti.",
            total: 560.25
          },
          {
            id: "INV-005",
            invoiceNumber: "F-2025-0005",
            date: "2025-04-28",
            customerName: "ABC Ltd. Şti.",
            total: 1890.30
          }
        ];
        
        setInvoices(dummyInvoices);
      } catch (error) {
        console.error("Faturalar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [customerId]);
  
  // Filtrelenmiş faturalar
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.date.includes(searchTerm)
  );
  
  // Fatura seçme
  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };
  
  // Seçili faturayı aktarma
  const handleTransfer = () => {
    if (selectedInvoice) {
      onClose(selectedInvoice);
    }
  };
  
  // İptal etme
  const handleCancel = () => {
    onClose();
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Fatura ara..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Faturalar yükleniyor...</span>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileText className="h-12 w-12 mb-2" />
            <p>Fatura bulunamadı</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Fatura No</TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Tarih
                  </div>
                </TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className={`cursor-pointer hover:bg-muted ${selectedInvoice?.id === invoice.id ? 'bg-primary/10' : ''}`}
                  onClick={() => handleSelectInvoice(invoice)}
                >
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell className="text-right">{invoice.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      
      <div className="p-4 border-t flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel}>
          İptal
        </Button>
        <Button 
          onClick={handleTransfer}
          disabled={!selectedInvoice}
        >
          Seçili Faturayı Aktar
        </Button>
      </div>
    </div>
  );
};
