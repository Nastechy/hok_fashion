import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Globe, Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import heroImage from '@/assets/hero-bag.jpg';

const About = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '50,000+' },
    { icon: Award, label: 'Years of Excellence', value: '25+' },
    { icon: Globe, label: 'Countries Served', value: '40+' },
    { icon: Heart, label: 'Handcrafted Bags', value: '100,000+' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-elegant">
          <div className="container px-6 md:px-14 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-5xl font-bold text-foreground font-playfair">
                  About HOK Fashion
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed font-inter">
                  For over 25 years, HOK Fashion has been crafting exceptional handbags that blend 
                  timeless elegance with modern functionality. Every piece tells a story of dedication, 
                  craftsmanship, and passion for fashion.
                </p>
                <Button variant="luxury" size="lg" className="font-inter font-medium">
                  Our Story
                </Button>
              </div>
              <div className="relative">
                <img
                  src={heroImage}
                  alt="HOK Fashion craftsmanship"
                  className="w-full h-auto rounded-2xl shadow-luxury"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container px-6  md:px-16">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl font-bold text-foreground font-playfair">
                Our Story
              </h2>
              <div className="prose prose-lg mx-auto font-inter">
                <p className="text-muted-foreground leading-relaxed">
                  Founded in 1998 by designer Helena Katarina, HOK Fashion began as a small atelier 
                  in New York with a simple mission: to create handbags that empower women to express 
                  their unique style with confidence.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  What started as a passion project has grown into a globally recognized brand, 
                  but our commitment to quality, craftsmanship, and customer satisfaction remains unchanged. 
                  Each bag is carefully designed and handcrafted using the finest materials, 
                  ensuring that every piece meets our exacting standards.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, HOK Fashion serves customers in over 40 countries, but we never forget 
                  our roots. We're still a family-owned business that values personal relationships 
                  and treats every customer like family.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-secondary/30">
          <div className="container px-6  md:px-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-card">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-8 w-8 text-red-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-red mb-2 font-playfair">
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground font-inter">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
                These core values guide everything we do at HOK Fashion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-playfair">
                    Quality First
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    We use only the finest materials and employ skilled artisans to ensure 
                    every bag meets our exacting quality standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-playfair">
                    Timeless Design
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    Our designs blend classic elegance with contemporary functionality, 
                    creating pieces that never go out of style.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-playfair">
                    Customer Care
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    Every customer is treated like family. We're committed to providing 
                    exceptional service and building lasting relationships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;