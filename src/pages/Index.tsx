import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Upload, Bell, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Lost Something?
                <span className="block text-primary">We'll Help You Find It</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with people who found what you lost. Post your found items to help others. 
                Our community-driven platform reunites people with their belongings every day.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/report-lost">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Report Lost Item
                  </Button>
                </Link>
                <Link to="/report-found">
                  <Button size="lg" variant="secondary">
                    I Found Something
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="People reunited with their belongings"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Report Your Loss</h3>
              <p className="text-muted-foreground text-sm">
                Describe what you lost with details, location, and date
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Post Found Items</h3>
              <p className="text-muted-foreground text-sm">
                Found something? Upload it to help someone reunite with their item
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Matched</h3>
              <p className="text-muted-foreground text-sm">
                Our system suggests potential matches based on your report
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Reunited</h3>
              <p className="text-muted-foreground text-sm">
                Connect directly and arrange to retrieve your belongings
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of helpful people reuniting owners with their belongings
          </p>
          <Link to="/browse">
            <Button size="lg" variant="default">
              Browse Lost & Found Items
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
