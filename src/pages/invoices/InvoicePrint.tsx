
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoice, getCategory, getProduct } from "@/lib/data-service";
import { Invoice } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";

const InvoicePrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  
  useEffect(() => {
    if (id) {
      const invoiceData = getInvoice(id);
      if (invoiceData) {
        setInvoice(invoiceData);
        
        // Auto print when component is mounted
        setTimeout(() => {
          window.print();
        }, 500);
      } else {
        navigate("/invoices");
      }
    }
  }, [id, navigate]);
  
  const getCategoryName = (categoryId: string) => {
    const category = getCategory(categoryId);
    return category ? category.name : "Unknown";
  };
  
  const getProductName = (productId: string) => {
    const product = getProduct(productId);
    return product ? product.name : "Unknown";
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (!invoice) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div>
      <div className="print:hidden flex items-center justify-between p-4 bg-white border-b">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/invoices/${id}`)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoice
        </Button>
        <Button 
          onClick={() => window.print()}
          className="flex items-center"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
      
      <div className="invoice-print-container py-8 px-6 md:px-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p className="text-gray-600">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">InvoiceApp</div>
            <p className="text-gray-600">Your Company Name</p>
            <p className="text-gray-600">Your Address</p>
            <p className="text-gray-600">contact@example.com</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
            <p className="font-medium">{invoice.customer.name}</p>
            {invoice.customer.address && (
              <p className="text-gray-600">{invoice.customer.address}</p>
            )}
            {invoice.customer.email && (
              <p className="text-gray-600">{invoice.customer.email}</p>
            )}
            {invoice.customer.phone && (
              <p className="text-gray-600">{invoice.customer.phone}</p>
            )}
          </div>
          
          <div className="text-right">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Invoice Date:</span>
                <span>{formatDate(invoice.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{invoice.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border border-gray-300 font-semibold">Item</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold">Description</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold text-right">Qty</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold text-right">Unit Price</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border border-gray-300">{getProductName(item.productId)}</td>
                <td className="py-2 px-4 border border-gray-300">{item.description}</td>
                <td className="py-2 px-4 border border-gray-300 text-right">{item.quantity} {item.unit}</td>
                <td className="py-2 px-4 border border-gray-300 text-right">{invoice.currency.symbol}{item.price.toFixed(2)}</td>
                <td className="py-2 px-4 border border-gray-300 text-right">{invoice.currency.symbol}{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>{invoice.currency.symbol}{invoice.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="font-medium">Tax ({invoice.taxRate}%):</span>
              <span>{invoice.currency.symbol}{invoice.taxAmount.toFixed(2)}</span>
            </div>
            
            {invoice.tipAmount > 0 && (
              <div className="flex justify-between py-2">
                <span className="font-medium">Tip:</span>
                <span>{invoice.currency.symbol}{invoice.tipAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
              <span>Total:</span>
              <span>{invoice.currency.symbol}{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <div className="mt-8 border-t border-gray-300 pt-4">
            <h3 className="font-semibold mb-2">Notes:</h3>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
