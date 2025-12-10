import { Shield, Truck, Star, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Durability You Can Trust',
    description: 'Each piece is crafted with high-grade materials built to make you slay effortlessly.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'We deliver across all 36 states fast, reliable, and affordable.',
  },
  {
    icon: Star,
    title: 'Customer Satisfaction',
    description: 'We ensure every order is accurately packed and handled with care from purchase to delivery.',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    description: 'Our team is always available to assist you with orders or delivery updates.',
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-6  md:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
            Why Choose HOK Fashion
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