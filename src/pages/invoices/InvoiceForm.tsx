import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  getInvoice, 
  createInvoice, 
  updateInvoice, 
  getCategories,
  getProductsByCategory,
  getCurrencies,
  calculateInvoiceItemTotal,
  calculateInvoiceTotals
} from "@/lib/data-service";
import { InvoiceItem, Currency, InvoiceStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const categories = getCategories();
  const allCurrencies = getCurrencies();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    customer: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
    items: [] as InvoiceItem[],
    taxRate: 0,
    tipAmount: 0,
    notes: "",
    currency: allCurrencies[0],
    status: "pending" as InvoiceStatus,
  });
  
  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  });
  
  useEffect(() => {
    if (isEditing && id) {
      const invoice = getInvoice(id);
      if (invoice) {
        setFormData({
          date: new Date(invoice.date).toISOString().split("T")[0],
          dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
          customer: { ...invoice.customer },
          items: [...invoice.items],
          taxRate: invoice.taxRate,
          tipAmount: invoice.tipAmount,
          notes: invoice.notes,
          currency: invoice.currency,
          status: invoice.status,
        });
      } else {
        toast.error("Invoice not found");
        navigate("/invoices");
      }
    } else {
      // Add an empty item for new invoices
      handleAddItem();
    }
  }, [id, isEditing, navigate]);
  
  // Recalculate totals when items, tax rate, or tip change
  useEffect(() => {
    const { subtotal, taxAmount, total } = calculateInvoiceTotals(
      formData.items,
      formData.taxRate,
      formData.tipAmount
    );
    
    setTotals({ subtotal, taxAmount, total });
  }, [formData.items, formData.taxRate, formData.tipAmount]);
  
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value,
      }
    }));
  };
  
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      categoryId: "",
      productId: "",
      description: "",
      quantity: 1,
      unit: "",
      price: 0,
      total: 0,
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };
  
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };
  
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...formData.items];
    
    if (field === "categoryId") {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        productId: "", // Reset product when category changes
        description: "",
        unit: "",
        price: 0,
        total: 0,
      };
    } else if (field === "productId" && value) {
      const products = getProductsByCategory(updatedItems[index].categoryId);
      const selectedProduct = products.find(p => p.id === value);
      
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          productId: value,
          description: selectedProduct.name,
          unit: selectedProduct.unit,
          price: selectedProduct.price,
          total: calculateInvoiceItemTotal(updatedItems[index].quantity, selectedProduct.price),
        };
      }
    } else if (field === "quantity" || field === "price") {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        total: calculateInvoiceItemTotal(
          field === "quantity" ? value : updatedItems[index].quantity,
          field === "price" ? value : updatedItems[index].price
        ),
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };
  
  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = allCurrencies.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      setFormData(prev => ({
        ...prev,
        currency: selectedCurrency,
      }));
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: "taxRate" | "tipAmount") => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };
  
  const validateForm = () => {
    if (!formData.customer.name.trim()) {
      toast.error("Customer name is required");
      return false;
    }
    
    if (formData.items.length === 0) {
      toast.error("At least one item is required");
      return false;
    }
    
    for (const [index, item] of formData.items.entries()) {
      if (!item.categoryId) {
        toast.error(`Please select a category for item ${index + 1}`);
        return false;
      }
      
      if (!item.productId) {
        toast.error(`Please select a product for item ${index + 1}`);
        return false;
      }
      
      if (item.quantity <= 0) {
        toast.error(`Quantity must be greater than 0 for item ${index + 1}`);
        return false;
      }
    }
    
    if (formData.taxRate < 0 || formData.taxRate > 100) {
      toast.error("Tax rate must be between 0% and 100%");
      return false;
    }
    
    if (formData.tipAmount < 0) {
      toast.error("Tip amount cannot be negative");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const invoiceData = {
        ...formData,
        ...totals,
      };
      
      if (isEditing && id) {
        updateInvoice(id, invoiceData);
        toast.success("Invoice updated successfully");
      } else {
        createInvoice(invoiceData);
        toast.success("Invoice created successfully");
      }
      navigate("/invoices");
    } catch (error) {
      toast.error("An error occurred while saving the invoice");
    }
  };
  
  const getProductOptions = (categoryId: string) => {
    if (!categoryId) return [];
    return getProductsByCategory(categoryId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/invoices")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Invoice" : "Create Invoice"}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invoice Details */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Invoice Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency.code} 
                  onValueChange={handleCurrencyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol}) - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Payment terms, delivery notes, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Name</Label>
                  <Input
                    id="customer-name"
                    name="name"
                    value={formData.customer.name}
                    onChange={handleCustomerChange}
                    placeholder="Customer name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    name="email"
                    type="email"
                    value={formData.customer.email}
                    onChange={handleCustomerChange}
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Address</Label>
                  <Textarea
                    id="customer-address"
                    name="address"
                    value={formData.customer.address}
                    onChange={handleCustomerChange}
                    placeholder="Customer address"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    name="phone"
                    value={formData.customer.phone}
                    onChange={handleCustomerChange}
                    placeholder="Customer phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Invoice Items */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Items</h2>
              <Button 
                type="button" 
                onClick={handleAddItem}
                variant="outline"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="w-40">
                        <Select
                          value={item.categoryId}
                          onValueChange={(value) => handleItemChange(index, "categoryId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="w-40">
                        <Select
                          value={item.productId}
                          onValueChange={(value) => handleItemChange(index, "productId", value)}
                          disabled={!item.categoryId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {getProductOptions(item.categoryId).map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          placeholder="Description"
                        />
                      </td>
                      <td className="w-20">
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value, 10) || 0)}
                        />
                      </td>
                      <td className="w-24">
                        <Input
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                          placeholder="Unit"
                        />
                      </td>
                      <td className="w-28">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </td>
                      <td className="w-28">
                        {formData.currency.symbol}{item.total.toFixed(2)}
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          disabled={formData.items.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Invoice Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formData.currency.symbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>Tax Rate:</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) => handleNumberChange(e, "taxRate")}
                      className="w-20 inline-flex"
                    />
                    <span className="ml-1">%</span>
                  </div>
                  <span className="font-medium">{formData.currency.symbol}{totals.taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>Tip:</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.tipAmount}
                      onChange={(e) => handleNumberChange(e, "tipAmount")}
                      className="w-24 inline-flex"
                    />
                  </div>
                  <span className="font-medium">{formData.currency.symbol}{formData.tipAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg">{formData.currency.symbol}{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/invoices")}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update" : "Create"} Invoice
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
