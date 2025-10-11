import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  created_at: string;
  updated_at: string;
}

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    features: [""]
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await apiClient.getServices();
      setServices(data);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const features = formData.features.filter(f => f.trim() !== "");
      
      if (editingService) {
        await apiClient.updateService(editingService.id, { ...formData, features });
        toast.success("Service updated successfully");
      } else {
        await apiClient.createService({ ...formData, features });
        toast.success("Service created successfully");
      }
      
      setShowDialog(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(editingService ? "Failed to update service" : "Failed to create service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await apiClient.deleteService(id);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features.length > 0 ? service.features : [""]
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", icon: "", features: [""] });
    setEditingService(null);
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [""] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <Button onClick={() => { resetForm(); setShowDialog(true); }}>
          <Plus className="h-4 w-4 ml-2" />
          New Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{service.title}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
            <p className="text-xs text-muted-foreground">Icon: {service.icon}</p>
            <div className="mt-2">
              <p className="text-xs font-semibold mb-1">Features:</p>
              <ul className="text-xs list-disc list-inside">
                {service.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Create Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="icon">Icon Name (Lucide React)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., Code, Smartphone, Globe"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Features</Label>
                <Button type="button" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 ml-2" />
                  Add Feature
                </Button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingService ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;
