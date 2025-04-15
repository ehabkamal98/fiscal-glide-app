
import { Category, Product, Invoice, Currency, InvoiceStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock Categories
export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "cat-2",
    name: "Office Supplies",
    description: "Office stationery and supplies",
    createdAt: new Date(2023, 1, 5).toISOString(),
  },
  {
    id: "cat-3",
    name: "Furniture",
    description: "Office and home furniture",
    createdAt: new Date(2023, 2, 20).toISOString(),
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: "prod-1",
    name: "Laptop",
    description: "High-performance laptop",
    categoryId: "cat-1",
    price: 1200,
    unit: "piece",
    createdAt: new Date(2023, 0, 20).toISOString(),
  },
  {
    id: "prod-2",
    name: "Monitor",
    description: "27-inch 4K monitor",
    categoryId: "cat-1",
    price: 350,
    unit: "piece",
    createdAt: new Date(2023, 1, 10).toISOString(),
  },
  {
    id: "prod-3",
    name: "Printer Paper",
    description: "A4 premium printer paper",
    categoryId: "cat-2",
    price: 15,
    unit: "ream",
    createdAt: new Date(2023, 2, 5).toISOString(),
  },
  {
    id: "prod-4",
    name: "Office Chair",
    description: "Ergonomic office chair",
    categoryId: "cat-3",
    price: 250,
    unit: "piece",
    createdAt: new Date(2023, 3, 15).toISOString(),
  },
];

// Mock Currencies
export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.78 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 150.2 },
];

// Generate a unique invoice number
export const generateInvoiceNumber = (): string => {
  const prefix = "INV";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

// Mock Invoices
export const invoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-123456-001",
    date: new Date(2023, 3, 1).toISOString(),
    dueDate: new Date(2023, 3, 15).toISOString(),
    customer: {
      name: "Acme Corporation",
      email: "billing@acme.com",
      address: "123 Main St, Anytown, CA 12345",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: "item-1",
        categoryId: "cat-1",
        productId: "prod-1",
        description: "Laptop",
        quantity: 2,
        unit: "piece",
        price: 1200,
        total: 2400,
      },
      {
        id: "item-2",
        categoryId: "cat-2",
        productId: "prod-3",
        description: "Printer Paper",
        quantity: 5,
        unit: "ream",
        price: 15,
        total: 75,
      },
    ],
    subtotal: 2475,
    taxRate: 8.5,
    taxAmount: 210.38,
    tipAmount: 0,
    total: 2685.38,
    notes: "Net 15 payment terms",
    status: "approved",
    currency: currencies[0],
    createdAt: new Date(2023, 3, 1).toISOString(),
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-123457-002",
    date: new Date(2023, 3, 15).toISOString(),
    dueDate: new Date(2023, 3, 30).toISOString(),
    customer: {
      name: "TechStart Inc",
      email: "accounts@techstart.io",
      address: "456 Tech Blvd, San Francisco, CA 94107",
      phone: "+1 (555) 987-6543",
    },
    items: [
      {
        id: "item-3",
        categoryId: "cat-1",
        productId: "prod-2",
        description: "Monitor",
        quantity: 3,
        unit: "piece",
        price: 350,
        total: 1050,
      },
      {
        id: "item-4",
        categoryId: "cat-3",
        productId: "prod-4",
        description: "Office Chair",
        quantity: 2,
        unit: "piece",
        price: 250,
        total: 500,
      },
    ],
    subtotal: 1550,
    taxRate: 8.5,
    taxAmount: 131.75,
    tipAmount: 50,
    total: 1731.75,
    notes: "Please include invoice number in payment reference",
    status: "pending",
    currency: currencies[0],
    createdAt: new Date(2023, 3, 15).toISOString(),
  },
];
