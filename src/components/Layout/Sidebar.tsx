
import { NavLink } from "react-router-dom";
import { Home, ListChecks, Package, FileText, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-lg transition-transform md:translate-x-0 md:static md:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">InvoiceApp</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <ListChecks className="mr-3 h-5 w-5" />
            Categories
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <Package className="mr-3 h-5 w-5" />
            Products
          </NavLink>
          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <FileText className="mr-3 h-5 w-5" />
            Invoices
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
