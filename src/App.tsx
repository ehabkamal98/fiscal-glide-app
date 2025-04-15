
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CategoriesList from "./pages/categories/CategoriesList";
import CategoryForm from "./pages/categories/CategoryForm";
import ProductsList from "./pages/products/ProductsList";
import ProductForm from "./pages/products/ProductForm";
import InvoicesList from "./pages/invoices/InvoicesList";
import InvoiceForm from "./pages/invoices/InvoiceForm";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import InvoicePrint from "./pages/invoices/InvoicePrint";
import CurrenciesManagement from "./pages/currencies/CurrenciesManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Category Routes */}
            <Route path="categories" element={<CategoriesList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            
            {/* Product Routes */}
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            
            {/* Invoice Routes */}
            <Route path="invoices" element={<InvoicesList />} />
            <Route path="invoices/new" element={<InvoiceForm />} />
            <Route path="invoices/edit/:id" element={<InvoiceForm />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
            <Route path="invoices/print/:id" element={<InvoicePrint />} />
            
            {/* Currency Management */}
            <Route path="currencies" element={<CurrenciesManagement />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
