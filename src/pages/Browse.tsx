import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface LostItem {
  id: string;
  item_name: string;
  category: string;
  description: string;
  last_seen_location: string;
  date_lost: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  image_url: string | null;
  created_at: string;
}

interface FoundItem {
  id: string;
  item_name: string;
  category: string;
  description: string;
  found_location: string;
  date_found: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  image_url: string | null;
  created_at: string;
}

const Browse = () => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    
    const { data: lost } = await supabase
      .from("lost_items")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    const { data: found } = await supabase
      .from("found_items")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (lost) setLostItems(lost);
    if (found) setFoundItems(found);
    setLoading(false);
  };

  const categoryColors: Record<string, string> = {
    electronics: "bg-blue-500/10 text-blue-500",
    clothing: "bg-purple-500/10 text-purple-500",
    accessories: "bg-pink-500/10 text-pink-500",
    bags: "bg-orange-500/10 text-orange-500",
    documents: "bg-yellow-500/10 text-yellow-500",
    keys: "bg-green-500/10 text-green-500",
    jewelry: "bg-red-500/10 text-red-500",
    other: "bg-gray-500/10 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Items</h1>
          <p className="text-muted-foreground">
            Search through lost and found items to find matches
          </p>
        </div>

        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
            <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="lost" className="mt-6">
            {loading ? (
              <p>Loading...</p>
            ) : lostItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No lost items reported yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{item.item_name}</CardTitle>
                        <Badge className={categoryColors[item.category] || "bg-gray-500/10"}>
                          {item.category}
                        </Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{item.last_seen_location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Lost on {format(new Date(item.date_lost), "PPP")}</span>
                      </div>
                      <div className="pt-4 border-t mt-4">
                        <p className="font-semibold text-sm mb-2">Contact: {item.contact_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${item.contact_email}`} className="hover:text-primary">
                            {item.contact_email}
                          </a>
                        </div>
                        {item.contact_phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${item.contact_phone}`} className="hover:text-primary">
                              {item.contact_phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="found" className="mt-6">
            {loading ? (
              <p>Loading...</p>
            ) : foundItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No found items reported yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{item.item_name}</CardTitle>
                        <Badge className={categoryColors[item.category] || "bg-gray-500/10"}>
                          {item.category}
                        </Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{item.found_location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Found on {format(new Date(item.date_found), "PPP")}</span>
                      </div>
                      {(item.contact_name || item.contact_email || item.contact_phone) && (
                        <div className="pt-4 border-t mt-4">
                          {item.contact_name && (
                            <p className="font-semibold text-sm mb-2">Contact: {item.contact_name}</p>
                          )}
                          {item.contact_email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${item.contact_email}`} className="hover:text-primary">
                                {item.contact_email}
                              </a>
                            </div>
                          )}
                          {item.contact_phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${item.contact_phone}`} className="hover:text-primary">
                                {item.contact_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Browse;
