
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoices, getCategories, getProducts } from "@/lib/data-service";
import { FileText, Package, Tag, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const invoices = getInvoices();
  const categories = getCategories();
  const products = getProducts();
  
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "approved")
    .reduce((sum, invoice) => sum + invoice.total, 0);
  
  const pendingInvoices = invoices.filter((invoice) => invoice.status === "pending").length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your invoice system
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From approved invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review or approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Available products
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <Link to={`/invoices/${invoice.id}`} className="font-medium text-blue-600 hover:underline">
                        {invoice.invoiceNumber}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {invoice.customer.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`status-badge status-${invoice.status}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                      <span className="ml-4 font-medium">
                        {invoice.currency.symbol}{invoice.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No invoices yet</p>
            )}
            
            <div className="mt-4">
              <Link to="/invoices" className="text-sm text-blue-600 hover:underline">
                View all invoices →
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link 
                to="/invoices/new" 
                className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
              >
                Create New Invoice
              </Link>
              <Link 
                to="/products/new" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2"
              >
                Add New Product
              </Link>
              <Link 
                to="/categories/new" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2"
              >
                Add New Category
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
