
import { useState, useEffect } from "react";
import { getCurrencies, updateCurrencyRate, createCurrency, deleteCurrency } from "@/lib/data-service";
import { Currency } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash, DollarSign } from "lucide-react";
import { toast } from "sonner";

const CurrenciesManagement = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    code: "",
    name: "",
    symbol: "",
  });
  const [deleteCode, setDeleteCode] = useState<string | null>(null);

  useEffect(() => {
    setCurrencies(getCurrencies());
  }, []);
  
  const handleRateChange = (code: string, rateStr: string) => {
    const rate = parseFloat(rateStr);
    
    if (isNaN(rate) || rate <= 0) {
      toast.error("Rate must be a positive number");
      return;
    }
    
    const updatedCurrency = updateCurrencyRate(code, rate);
    
    if (updatedCurrency) {
      setCurrencies(getCurrencies());
      toast.success(`Rate updated for ${updatedCurrency.name}`);
    }
  };
  
  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.symbol) {
      toast.error("All fields are required");
      return;
    }
    
    // Check if currency code already exists
    if (currencies.some(c => c.code === newCurrency.code)) {
      toast.error("Currency code already exists");
      return;
    }
    
    const createdCurrency = createCurrency(newCurrency);
    setCurrencies([...currencies, createdCurrency]);
    setIsAddDialogOpen(false);
    setNewCurrency({ code: "", name: "", symbol: "" });
    toast.success(`${createdCurrency.name} added successfully`);
  };
  
  const handleDeleteCurrency = (code: string) => {
    const result = deleteCurrency(code);
    
    if (result) {
      setCurrencies(getCurrencies());
      toast.success("Currency deleted successfully");
    } else {
      toast.error("Cannot delete this currency as it's in use or it's the last one");
    }
    
    setDeleteCode(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Currency Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Currency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Currency</DialogTitle>
              <DialogDescription>
                Add a new currency and set its exchange rate
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  value={newCurrency.code}
                  onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                  placeholder="USD"
                  className="col-span-3"
                  maxLength={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                  placeholder="US Dollar"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="symbol" className="text-right">
                  Symbol
                </Label>
                <Input
                  id="symbol"
                  value={newCurrency.symbol}
                  onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                  placeholder="$"
                  className="col-span-3"
                  maxLength={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCurrency}>
                Add Currency
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currencies and Exchange Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell className="font-medium">{currency.code}</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell>{currency.symbol}</TableCell>
                  <TableCell>
                    <div className="flex items-center max-w-[150px]">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <Input 
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={currency.rate}
                        onChange={(e) => handleRateChange(currency.code, e.target.value)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <AlertDialog open={deleteCode === currency.code} onOpenChange={(open) => !open && setDeleteCode(null)}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setDeleteCode(currency.code)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the {currency.name} currency. 
                            This action cannot be undone if there are invoices using this currency.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteCurrency(currency.code)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrenciesManagement;
