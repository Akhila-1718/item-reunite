import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { User } from "@supabase/supabase-js";

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "bags", label: "Bags" },
  { value: "documents", label: "Documents" },
  { value: "keys", label: "Keys" },
  { value: "jewelry", label: "Jewelry" },
  { value: "other", label: "Other" },
];

const ReportLost = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    lastSeenLocation: "",
    dateLost: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to report a lost item");
        navigate("/auth");
      } else {
        setUser(session.user);
        setFormData((prev) => ({
          ...prev,
          contactEmail: session.user.email || "",
        }));
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("item-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("lost_items").insert({
        user_id: user.id,
        item_name: formData.itemName,
        category: formData.category as any,
        description: formData.description,
        last_seen_location: formData.lastSeenLocation,
        date_lost: formData.dateLost,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast.success("Lost item reported successfully!");
      navigate("/browse");
    } catch (error: any) {
      toast.error(error.message || "Failed to report lost item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Report a Lost Item</CardTitle>
              <CardDescription>
                Fill in the details about your lost item to help us find it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="e.g., iPhone 13, Blue Backpack"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your item in detail (color, brand, distinguishing features...)"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Last Seen Location *</Label>
                    <Input
                      id="location"
                      value={formData.lastSeenLocation}
                      onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                      placeholder="e.g., Central Park, Downtown Mall"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateLost">Date Lost *</Label>
                    <Input
                      id="dateLost"
                      type="date"
                      value={formData.dateLost}
                      onChange={(e) => setFormData({ ...formData, dateLost: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone (Optional)</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {imageFile ? imageFile.name : "Click to upload an image"}
                      </p>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Report Lost Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;
