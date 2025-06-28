export interface BankingReceiptData {
  transactionAmount: number;
  beneficiaryName: string;
  senderName: string;
  paidOn: string;
  fees: number;
  description: string;
  transactionRef: string;
  paymentType: string;
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ShoppingReceiptData {
  storeName: string;
  orderNumber: string;
  orderDate: string;
  items: ShoppingItem[];
  shippingCost: number;
  paymentMethod: string;
  status: string;
  supportEmail: string;
}

export interface Receipt {
  id: string;
  userId: string;
  type: 'banking' | 'shopping';
  title: string;
  data: BankingReceiptData | ShoppingReceiptData;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
