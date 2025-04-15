
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  getProduct, 
  createProduct, 
  updateProduct, 
  getCategories 
} from "@/lib/data-service";
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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    unit: "",
  });
  
  const categories = getCategories();
  
  useEffect(() => {
    if (isEditing) {
      const product = getProduct(id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          price: product.price.toString(),
          unit: product.unit,
        });
      } else {
        toast.error("Product not found");
        navigate("/products");
      }
    }
  }, [id, isEditing, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    if (!formData.unit.trim()) {
      toast.error("Unit is required");
      return;
    }
    
    try {
      const productData = {
        ...formData,
        price,
      };
      
      if (isEditing && id) {
        updateProduct(id, productData);
        toast.success("Product updated successfully");
      } else {
        createProduct(productData);
        toast.success("Product created successfully");
      }
      navigate("/products");
    } catch (error) {
      toast.error("An error occurred while saving the product");
    }
  };
  
  const unitOptions = ["piece", "kg", "gram", "liter", "meter", "box", "pack", "set", "pair", "ream", "hour", "service"];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/products")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Product" : "Create Product"}
        </h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => handleSelectChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleSelectChange("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/products")}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update" : "Create"} Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
