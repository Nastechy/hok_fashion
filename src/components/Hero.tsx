import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bag.jpg';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero = ({ onExploreClick }: HeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-elegant">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight font-playfair">
              Luxury
              <span className="text-red block">Handbags</span>
              Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg font-inter">
              Discover our exquisite collection of handcrafted leather bags, 
              designed for the modern woman who values both style and functionality.
            </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="luxury" 
                size="lg" 
                className="text-lg px-8 py-6 font-inter font-medium"
                onClick={onExploreClick}
              >
                Explore Collection
              </Button>
              <Button 
                variant="elegant" 
                size="lg" 
                className="text-lg px-8 py-6 font-inter font-medium"
                onClick={() => window.location.href = '/lookbook'}
              >
                View Lookbook
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Luxury handbag collection"
                className="w-full h-auto rounded-2xl shadow-luxury"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-luxury opacity-20 rounded-2xl blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-luxury/10 rounded-full blur-3xl hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl hidden lg:block"></div>
    </section>
  );
};