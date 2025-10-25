// טיפוס לתשובה כשצריך לדייק יותר
export interface NeedMoreInfoResponse {
  needsMoreInfo: true;
  category: string;
  options: string[];
  message: string;
}

// טיפוס לתשובה עם מחיר והנחה
export interface PriceResponse {
  needsMoreInfo: false;
  productName: string;
  category: string;
  estimatedPrice: number;
  groupDiscount: number; // אחוז הנחה בהתאם לקבוצת רכישה
  finalPrice: number;
  notes: string;
}

export type SmartSearchResponse = NeedMoreInfoResponse | PriceResponse;
