"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";

// Gelir tipi
interface Revenue {
  id?: string;
  date: Date | undefined;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
}

interface RevenueProcessModalProps {
  initialData?: Revenue; // Düzenleme için başlangıç verileri (opsiyonel)
  title?: string;
  onClose: (savedData?: Revenue) => void;
}

export const RevenueProcessModal = ({
  initialData,
  title = initialData ? "Gelir Düzenle" : "Yeni Gelir Ekle",
  onClose
}: RevenueProcessModalProps) => {
  const [formData, setFormData] = useState<Revenue>(
    initialData || {
      date: undefined,
      amount: 0,
      category: "",
      description: "",
      paymentMethod: "cash"
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Form değişikliklerini işle
  const handleChange = (field: keyof Revenue, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Hata varsa temizle
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Formu doğrula
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = "Tarih seçmelisiniz";
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Geçerli bir tutar girmelisiniz";
    }
    
    if (!formData.category) {
      newErrors.category = "Kategori seçmelisiniz";
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Ödeme yöntemi seçmelisiniz";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Formu kaydet
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Gerçek uygulamada burada API çağrısı yapılacak
      // Örnek: const response = await fetch('/api/revenues', { method: 'POST', body: JSON.stringify(formData) });
      
      // Simüle edilmiş gecikme
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Başarılı sonuç simülasyonu
      const savedData: Revenue = {
        ...formData,
        id: initialData?.id || `REV-${Date.now()}`
      };
      
      onClose(savedData);
    } catch (error) {
      console.error("Gelir kaydedilirken hata oluştu:", error);
      setErrors({ submit: "Gelir kaydedilirken bir hata oluştu. Lütfen tekrar deneyin." });
    } finally {
      setIsSaving(false);
    }
  };
  
  // İptal et
  const handleCancel = () => {
    onClose();
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {/* Tarih */}
          <div className="grid gap-2">
            <Label htmlFor="date" className={errors.date ? "text-destructive" : ""}>
              Tarih <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                    errors.date && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP", { locale: tr })
                  ) : (
                    <span>Tarih seçin</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>
          
          {/* Tutar */}
          <div className="grid gap-2">
            <Label htmlFor="amount" className={errors.amount ? "text-destructive" : ""}>
              Tutar (₺) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount || ""}
              onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>
          
          {/* Kategori */}
          <div className="grid gap-2">
            <Label htmlFor="category" className={errors.category ? "text-destructive" : ""}>
              Kategori <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Satış Geliri</SelectItem>
                <SelectItem value="service">Hizmet Geliri</SelectItem>
                <SelectItem value="rental">Kira Geliri</SelectItem>
                <SelectItem value="interest">Faiz Geliri</SelectItem>
                <SelectItem value="other">Diğer Gelirler</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>
          
          {/* Ödeme Yöntemi */}
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod" className={errors.paymentMethod ? "text-destructive" : ""}>
              Ödeme Yöntemi <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange("paymentMethod", value)}
            >
              <SelectTrigger id="paymentMethod" className={errors.paymentMethod ? "border-destructive" : ""}>
                <SelectValue placeholder="Ödeme yöntemi seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Nakit</SelectItem>
                <SelectItem value="credit_card">Kredi Kartı</SelectItem>
                <SelectItem value="bank_transfer">Banka Havalesi</SelectItem>
                <SelectItem value="check">Çek</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">{errors.paymentMethod}</p>
            )}
          </div>
          
          {/* Açıklama */}
          <div className="grid gap-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Gelir hakkında açıklama girin"
              rows={3}
            />
          </div>
          
          {/* Genel Hata */}
          {errors.submit && (
            <div className="bg-destructive/10 p-3 rounded-md">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
          İptal
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
