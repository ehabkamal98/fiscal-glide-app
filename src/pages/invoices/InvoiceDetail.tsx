
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getInvoice, updateInvoiceStatus, getCategory, getProduct } from "@/lib/data-service";
import { Invoice, InvoiceStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft,
  Printer, 
  MoreHorizontal, 
  Pencil, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle 
} from "lucide-react";
import { toast } from "sonner";

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  
  useEffect(() => {
    if (id) {
      const invoiceData = getInvoice(id);
      if (invoiceData) {
        setInvoice(invoiceData);
      } else {
        toast.error("Invoice not found");
        navigate("/invoices");
      }
    }
  }, [id, navigate]);
  
  const handleStatusChange = (status: InvoiceStatus) => {
    if (id && invoice) {
      updateInvoiceStatus(id, status);
      setInvoice({
        ...invoice,
        status,
      });
      toast.success(`Invoice status updated to ${status}`);
    }
  };
  
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
  
  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "review":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  if (!invoice) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/invoices")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Invoice {invoice.invoiceNumber}
              <Badge className={`status-${invoice.status} ml-2`} variant="outline">
                <span className="flex items-center gap-1">
                  {getStatusIcon(invoice.status)}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Created on {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/invoices/print/${id}`} target="_blank">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to={`/invoices/edit/${id}`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                disabled={invoice.status === "pending"}
                onClick={() => handleStatusChange("pending")}
              >
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={invoice.status === "review"}
                onClick={() => handleStatusChange("review")}
              >
                Mark as In Review
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={invoice.status === "approved"}
                onClick={() => handleStatusChange("approved")}
              >
                Mark as Approved
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={invoice.status === "canceled"}
                onClick={() => handleStatusChange("canceled")}
              >
                Mark as Canceled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
              <dd className="text-sm">{invoice.invoiceNumber}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Invoice Date</dt>
              <dd className="text-sm">{formatDate(invoice.date)}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className="text-sm">{formatDate(invoice.dueDate)}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Currency</dt>
              <dd className="text-sm">{invoice.currency.code} ({invoice.currency.symbol})</dd>
            </dl>
            
            {invoice.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="text-sm mt-1">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Customer Information */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm">{invoice.customer.name}</dd>
              
              {invoice.customer.email && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm">{invoice.customer.email}</dd>
                </>
              )}
              
              {invoice.customer.phone && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm">{invoice.customer.phone}</dd>
                </>
              )}
            </dl>
            
            {invoice.customer.address && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="text-sm mt-1">{invoice.customer.address}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Invoice Items */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full invoice-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td>{getCategoryName(item.categoryId)}</td>
                    <td>{getProductName(item.productId)}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{invoice.currency.symbol}{item.price.toFixed(2)}</td>
                    <td>{invoice.currency.symbol}{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Invoice Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span>{invoice.currency.symbol}{invoice.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-500">Tax ({invoice.taxRate}%):</span>
                <span>{invoice.currency.symbol}{invoice.taxAmount.toFixed(2)}</span>
              </div>
              
              {invoice.tipAmount > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-500">Tip:</span>
                  <span>{invoice.currency.symbol}{invoice.tipAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-medium">
                <span>Total:</span>
                <span className="text-lg">{invoice.currency.symbol}{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
