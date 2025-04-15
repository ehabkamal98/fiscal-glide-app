
import {
  Category,
  Product,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Currency,
} from "@/types";
import {
  categories as mockCategories,
  products as mockProducts,
  invoices as mockInvoices,
  currencies as mockCurrencies,
  generateInvoiceNumber,
} from "./mock-data";
import { v4 as uuidv4 } from "uuid";

// Mock storage in localStorage
const initializeStorage = () => {
  if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(mockCategories));
  }
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem("invoices")) {
    localStorage.setItem("invoices", JSON.stringify(mockInvoices));
  }
  if (!localStorage.getItem("currencies")) {
    localStorage.setItem("currencies", JSON.stringify(mockCurrencies));
  }
};

// Initialize storage on import
initializeStorage();

// Category CRUD
export const getCategories = (): Category[] => {
  return JSON.parse(localStorage.getItem("categories") || "[]");
};

export const getCategory = (id: string): Category | undefined => {
  const categories = getCategories();
  return categories.find((category) => category.id === id);
};

export const createCategory = (category: Omit<Category, "id" | "createdAt">): Category => {
  const newCategory: Category = {
    id: uuidv4(),
    ...category,
    createdAt: new Date().toISOString(),
  };
  
  const categories = getCategories();
  const updatedCategories = [...categories, newCategory];
  localStorage.setItem("categories", JSON.stringify(updatedCategories));
  
  return newCategory;
};

export const updateCategory = (id: string, category: Partial<Omit<Category, "id" | "createdAt">>): Category | undefined => {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  
  if (index === -1) return undefined;
  
  const updatedCategory = { ...categories[index], ...category };
  categories[index] = updatedCategory;
  localStorage.setItem("categories", JSON.stringify(categories));
  
  return updatedCategory;
};

export const deleteCategory = (id: string): boolean => {
  const categories = getCategories();
  const filteredCategories = categories.filter((category) => category.id !== id);
  
  // Check if any products use this category
  const products = getProducts();
  const hasProducts = products.some((product) => product.categoryId === id);
  
  if (hasProducts) {
    return false;
  }
  
  localStorage.setItem("categories", JSON.stringify(filteredCategories));
  return true;
};

// Product CRUD
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem("products") || "[]");
};

export const getProduct = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  const products = getProducts();
  return products.filter((product) => product.categoryId === categoryId);
};

export const createProduct = (product: Omit<Product, "id" | "createdAt">): Product => {
  const newProduct: Product = {
    id: uuidv4(),
    ...product,
    createdAt: new Date().toISOString(),
  };
  
  const products = getProducts();
  const updatedProducts = [...products, newProduct];
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  
  return newProduct;
};

export const updateProduct = (id: string, product: Partial<Omit<Product, "id" | "createdAt">>): Product | undefined => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  
  if (index === -1) return undefined;
  
  const updatedProduct = { ...products[index], ...product };
  products[index] = updatedProduct;
  localStorage.setItem("products", JSON.stringify(products));
  
  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter((product) => product.id !== id);
  
  // Check if any invoices use this product
  const invoices = getInvoices();
  const hasInvoiceItems = invoices.some((invoice) => 
    invoice.items.some((item) => item.productId === id)
  );
  
  if (hasInvoiceItems) {
    return false;
  }
  
  localStorage.setItem("products", JSON.stringify(filteredProducts));
  return true;
};

// Invoice operations
export const getInvoices = (): Invoice[] => {
  return JSON.parse(localStorage.getItem("invoices") || "[]");
};

export const getInvoice = (id: string): Invoice | undefined => {
  const invoices = getInvoices();
  return invoices.find((invoice) => invoice.id === id);
};

export const createInvoice = (invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">): Invoice => {
  const newInvoice: Invoice = {
    id: uuidv4(),
    invoiceNumber: generateInvoiceNumber(),
    ...invoice,
    createdAt: new Date().toISOString(),
  };
  
  const invoices = getInvoices();
  const updatedInvoices = [...invoices, newInvoice];
  localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  
  return newInvoice;
};

export const updateInvoice = (id: string, invoice: Partial<Omit<Invoice, "id" | "invoiceNumber" | "createdAt">>): Invoice | undefined => {
  const invoices = getInvoices();
  const index = invoices.findIndex((inv) => inv.id === id);
  
  if (index === -1) return undefined;
  
  const updatedInvoice = { ...invoices[index], ...invoice };
  invoices[index] = updatedInvoice;
  localStorage.setItem("invoices", JSON.stringify(invoices));
  
  return updatedInvoice;
};

export const deleteInvoice = (id: string): boolean => {
  const invoices = getInvoices();
  const filteredInvoices = invoices.filter((invoice) => invoice.id !== id);
  localStorage.setItem("invoices", JSON.stringify(filteredInvoices));
  return true;
};

export const updateInvoiceStatus = (id: string, status: InvoiceStatus): Invoice | undefined => {
  return updateInvoice(id, { status });
};

// Currency operations
export const getCurrencies = (): Currency[] => {
  return JSON.parse(localStorage.getItem("currencies") || "[]");
};

export const getCurrency = (code: string): Currency | undefined => {
  const currencies = getCurrencies();
  return currencies.find((currency) => currency.code === code);
};

export const createCurrency = (currency: Omit<Currency, "rate">): Currency => {
  const newCurrency: Currency = {
    ...currency,
    rate: 1, // Default rate for new currencies
  };
  
  const currencies = getCurrencies();
  const updatedCurrencies = [...currencies, newCurrency];
  localStorage.setItem("currencies", JSON.stringify(updatedCurrencies));
  
  return newCurrency;
};

export const updateCurrencyRate = (code: string, rate: number): Currency | undefined => {
  const currencies = getCurrencies();
  const index = currencies.findIndex((currency) => currency.code === code);
  
  if (index === -1) return undefined;
  
  const updatedCurrency = { ...currencies[index], rate };
  currencies[index] = updatedCurrency;
  localStorage.setItem("currencies", JSON.stringify(currencies));
  
  return updatedCurrency;
};

export const deleteCurrency = (code: string): boolean => {
  const currencies = getCurrencies();
  
  // Check if any invoices use this currency
  const invoices = getInvoices();
  const hasInvoices = invoices.some((invoice) => invoice.currency.code === code);
  
  if (hasInvoices) {
    return false;
  }
  
  const filteredCurrencies = currencies.filter((currency) => currency.code !== code);
  
  // Don't allow deleting if it's the last currency
  if (filteredCurrencies.length === 0) {
    return false;
  }
  
  localStorage.setItem("currencies", JSON.stringify(filteredCurrencies));
  return true;
};

// Invoice calculations
export const calculateInvoiceItemTotal = (quantity: number, price: number): number => {
  return quantity * price;
};

export const calculateInvoiceSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

export const calculateInvoiceTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

export const calculateInvoiceTotal = (subtotal: number, taxAmount: number, tipAmount: number): number => {
  return subtotal + taxAmount + tipAmount;
};

export const calculateInvoiceTotals = (items: InvoiceItem[], taxRate: number, tipAmount: number) => {
  const subtotal = calculateInvoiceSubtotal(items);
  const taxAmount = calculateInvoiceTax(subtotal, taxRate);
  const total = calculateInvoiceTotal(subtotal, taxAmount, tipAmount);
  
  return { subtotal, taxAmount, total };
};

// Convert amount between currencies
export const convertCurrencyAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
  // Convert from source currency to base rate (USD assumed to be 1.0)
  const amountInBase = amount / fromCurrency.rate;
  // Convert from base rate to target currency
  return amountInBase * toCurrency.rate;
};
