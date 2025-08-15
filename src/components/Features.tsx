import { Shield, Truck, RotateCcw, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Authentic Guarantee',
    description: 'Every bag comes with a certificate of authenticity and lifetime warranty.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary shipping on all orders over $200 worldwide.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return your purchase within 30 days for a full refund.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Handcrafted using the finest materials by skilled artisans.',
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
            Why Choose Luxe Bags
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            We're committed to providing exceptional quality and service that exceeds your expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-red-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 font-playfair">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-inter">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};