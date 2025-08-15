import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-bag.jpg';
import bag1 from '@/assets/bag-1.jpg';
import bag2 from '@/assets/bag-2.jpg';
import bag3 from '@/assets/bag-3.jpg';
import bag4 from '@/assets/bag-4.jpg';

const Lookbook = () => {
  const lookbookItems = [
    {
      id: 1,
      title: 'Spring Elegance',
      description: 'Discover our spring collection featuring light colors and modern silhouettes.',
      image: bag1,
      season: 'Spring 2024',
      featured: ['Classic Black Tote', 'Beige Crossbody']
    },
    {
      id: 2,
      title: 'Executive Power',
      description: 'Professional pieces that command respect in the boardroom.',
      image: bag2,
      season: 'Business Collection',
      featured: ['Executive Briefcase', 'Shoulder Bag Deluxe']
    },
    {
      id: 3,
      title: 'Evening Glamour',
      description: 'Sophisticated clutches for your most special occasions.',
      image: bag3,
      season: 'Evening Collection',
      featured: ['Evening Clutch', 'Luxury Evening Clutch']
    },
    {
      id: 4,
      title: 'Weekend Wanderer',
      description: 'Perfect companions for your weekend adventures and travels.',
      image: bag4,
      season: 'Travel Collection',
      featured: ['Weekend Travel Tote', 'Brown Leather Tote']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-elegant">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground font-playfair">
                Lookbook
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Explore our curated collections and discover how our handbags complement every style, 
                occasion, and season. Get inspired by our styling suggestions and find your perfect match.
              </p>
              <Button variant="luxury" size="lg" className="font-inter font-medium">
                Shop the Collections
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Look */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <Badge className="bg-red text-red-foreground font-inter">Featured Look</Badge>
                <h2 className="text-4xl font-bold text-foreground font-playfair">
                  Timeless Sophistication
                </h2>
                <p className="text-lg text-muted-foreground font-inter leading-relaxed">
                  The perfect blend of classic elegance and modern functionality. 
                  Our signature black leather tote embodies everything HOK Fashion stands for - 
                  quality craftsmanship, timeless design, and effortless style.
                </p>
                <div className="space-y-3">
                  <p className="font-semibold text-foreground font-inter">Featured in this look:</p>
                  <ul className="space-y-2 text-muted-foreground font-inter">
                    <li>• Classic Black Tote - $299</li>
                    <li>• Premium leather construction</li>
                    <li>• Gold-tone hardware accents</li>
                    <li>• Spacious interior with organization pockets</li>
                  </ul>
                </div>
                <Button variant="luxury" className="font-inter font-medium">
                  Shop This Look
                </Button>
              </div>
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Featured look - Classic Black Tote"
                  className="w-full h-auto rounded-2xl shadow-luxury"
                />
                <div className="absolute -inset-4 bg-gradient-luxury opacity-20 rounded-2xl blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Lookbook Grid */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
                Seasonal Collections
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
                Each season brings new inspirations and fresh perspectives on timeless elegance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lookbookItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-end p-6">
                      <div className="text-white space-y-2">
                        <Badge className="bg-white/20 text-white border-white/30 font-inter">
                          {item.season}
                        </Badge>
                        <h3 className="text-2xl font-bold font-playfair">{item.title}</h3>
                        <p className="text-white/90 font-inter">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2 font-inter">Featured Products:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.featured.map((product, index) => (
                            <Badge key={index} variant="outline" className="font-inter">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full font-inter">
                        View Collection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Styling Tips */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
                Styling Tips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
                Expert advice on how to style your HOK Fashion handbags for any occasion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-playfair">
                    Work to Weekend
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    Choose versatile pieces that transition seamlessly from professional 
                    meetings to weekend brunches. Look for classic colors and timeless silhouettes.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-playfair">
                    Color Coordination
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    Create cohesive looks by matching your handbag to key elements in your outfit. 
                    Black and neutral tones offer maximum versatility.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-playfair">
                    Size Matters
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    Consider the occasion and your needs. Totes for busy days, crossbodies for 
                    hands-free convenience, and clutches for elegant evenings.
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

export default Lookbook;