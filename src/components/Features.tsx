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
      <div className="container px-4 md:px-16">
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
            <Card
              key={index}
              className="group relative overflow-hidden text-center border border-transparent bg-white/80 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_14px_50px_-18px_rgba(0,0,0,0.25)] hover:border-red/40"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_20%_20%,hsl(0_50%_93%)/0.5,transparent_50%),radial-gradient(circle_at_80%_0%,hsl(0_50%_85%)/0.35,transparent_45%)]" />
              <CardContent className="relative p-8">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="h-8 w-8 text-red-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 font-playfair">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-inter transition-colors duration-500 group-hover:text-foreground">
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
