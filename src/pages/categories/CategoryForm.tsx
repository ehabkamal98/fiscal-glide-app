
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  getCategory, 
  createCategory, 
  updateCategory 
} from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  
  useEffect(() => {
    if (isEditing) {
      const category = getCategory(id);
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
        });
      } else {
        toast.error("Category not found");
        navigate("/categories");
      }
    }
  }, [id, isEditing, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    try {
      if (isEditing && id) {
        updateCategory(id, formData);
        toast.success("Category updated successfully");
      } else {
        createCategory(formData);
        toast.success("Category created successfully");
      }
      navigate("/categories");
    } catch (error) {
      toast.error("An error occurred while saving the category");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/categories")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Category" : "Create Category"}
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
                placeholder="Category name"
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
                placeholder="Category description"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/categories")}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update" : "Create"} Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;
