
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  getInvoices, 
  deleteInvoice, 
  updateInvoiceStatus 
} from "@/lib/data-service";
import { InvoiceStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Pencil, Trash, MoreHorizontal, Search, Printer } from "lucide-react";
import { toast } from "sonner";

const InvoicesList = () => {
  const [invoices, setInvoices] = useState(getInvoices());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "">("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setInvoices(getInvoices());
    setDeleteId(null);
    toast.success("Invoice deleted successfully");
  };
  
  const handleStatusChange = (id: string, status: InvoiceStatus) => {
    updateInvoiceStatus(id, status);
    setInvoices(getInvoices());
    toast.success(`Invoice status updated to ${status}`);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage your invoices and track payments
          </p>
        </div>
        <Link to="/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-[180px]">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as InvoiceStatus | "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <Link to={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.customer.name}</TableCell>
                  <TableCell>{invoice.currency.symbol}{invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`status-badge status-${invoice.status}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/invoices/${invoice.id}`}>
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/invoices/edit/${invoice.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/invoices/print/${invoice.id}`} target="_blank">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(invoice.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        
                        {/* Status update options */}
                        <DropdownMenuItem 
                          disabled={invoice.status === "pending"}
                          onClick={() => handleStatusChange(invoice.id, "pending")}
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          disabled={invoice.status === "review"}
                          onClick={() => handleStatusChange(invoice.id, "review")}
                        >
                          Mark as In Review
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          disabled={invoice.status === "approved"}
                          onClick={() => handleStatusChange(invoice.id, "approved")}
                        >
                          Mark as Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          disabled={invoice.status === "canceled"}
                          onClick={() => handleStatusChange(invoice.id, "canceled")}
                        >
                          Mark as Canceled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {(searchTerm || statusFilter) ? "No invoices match your filters" : "No invoices found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoicesList;
