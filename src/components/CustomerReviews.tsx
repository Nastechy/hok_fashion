import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ShieldCheck } from 'lucide-react';
import { reviews } from '@/data/reviews';

export const CustomerReviews = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            Don't just take our word for it. Here's what our valued customers have to say about their HOK Fashion experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < review.rating 
                            ? 'fill-red text-red' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  {review.verified && (
                    <div className="ml-2 flex items-center text-green-600">
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-6 font-inter leading-relaxed">
                  "{review.comment}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-red text-red-foreground">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm font-inter">{review.name}</p>
                      <p className="text-xs text-muted-foreground font-inter">{review.product}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-inter">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};