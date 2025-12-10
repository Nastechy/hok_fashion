import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bag.jpg';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero = ({ onExploreClick }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-elegant overflow-hidden">
      <div className="container px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 motion-fade">
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
                className="text-lg px-8 py-4 font-inter font-medium"
                onClick={onExploreClick}
              >
                Explore Collection
              </Button>
              <Button
                variant="elegant"
                size="lg"
                className="text-lg px-8 py-4 font-inter font-medium"
                onClick={() => window.location.href = '/lookbook'}
              >
                View Lookbook
              </Button>
            </div>
          </div>

          <div className="relative motion-float">
            <div className="relative z-10 shadow-luxury rounded-2xl overflow-hidden">
              <img
                src={heroImage}
                alt="Luxury handbag collection"
                className="w-full md:min-h-[450px] rounded-2xl shadow-luxury"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-luxury opacity-20 rounded-2xl blur-xl"></div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-20 w-32 h-32 bg-luxury/10 rounded-full blur-3xl hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl hidden lg:block"></div>
    </section>
  );
};
