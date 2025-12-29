import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bag.jpg';
import { useQuery } from '@tanstack/react-query';
import { hokApi, Product } from '@/services/hokApi';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero = ({ onExploreClick }: HeroProps) => {
  const navigate = useNavigate();
  const { data: newArrivalsData } = useQuery({
    queryKey: ['hero-sales'],
    queryFn: () => hokApi.fetchProducts({ isFeatured: true }),
  });
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const salesProducts: Product[] = newArrivalsData?.data ?? [];

  const slides = salesProducts.length ? salesProducts : [];

  useEffect(() => {
    if (!carouselApi || slides.length <= 1) return;

    const autoSwipe = setInterval(() => {
      carouselApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoSwipe);
  }, [carouselApi, slides.length]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(0_0%_95%)] via-[hsl(0_0%_90%)] to-[hsl(0_40%_92%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,hsl(0_50%_90%)/0.28,transparent_38%),radial-gradient(circle_at_85%_10%,hsl(0_35%_86%)/0.22,transparent_40%)]" />
      <div className="container relative z-10 px-4 md:px-16 py-14 md:py-20">
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

          <div className="relative motion-float lg:pl-6">
            <div className="relative z-10 rounded-[32px] overflow-hidden bg-white/95 shadow-luxury border border-border/50 p-6">
              {slides.length > 0 ? (
                <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
                  <CarouselContent>
                    {slides.map((product) => {
                      const cover = product.imageUrls?.[0] || product.images?.[0] || heroImage;
                      return (
                        <CarouselItem key={product.id}>
                          <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl bg-white">
                              <img
                                src={cover}
                                alt={product.name}
                                className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl cursor-pointer"
                                onClick={() => navigate(`/products/${product.id}`)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs uppercase text-muted-foreground tracking-wide">Featured</p>
                                <p className="text-lg font-semibold text-foreground">{product.name}</p>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 md:left-4" />
                  <CarouselNext className="right-2 md:right-4" />
                </Carousel>
              ) : (
                <div className="relative z-10 shadow-luxury rounded-2xl overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Luxury handbag collection"
                    className="w-full h-[400px] md:h-[500px] rounded-2xl shadow-luxury object-cover"
                  />
                </div>
              )}
            </div>
            <div className="absolute -inset-6 bg-gradient-luxury opacity-20 rounded-3xl blur-2xl"></div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-20 w-32 h-32 bg-luxury/10 rounded-full blur-3xl hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl hidden lg:block"></div>
    </section>
  );
};
