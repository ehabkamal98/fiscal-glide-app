
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  unit: string;
  createdAt: string;
}

export interface Customer {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface InvoiceItem {
  id: string;
  categoryId: string;
  productId: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export type InvoiceStatus = 'pending' | 'review' | 'approved' | 'canceled';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
  notes: string;
  status: InvoiceStatus;
  currency: Currency;
  createdAt: string;
}
