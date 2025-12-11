import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ShieldCheck } from 'lucide-react';
import { reviews } from '@/data/reviews';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { hokApi } from '@/services/hokApi';
import { toast } from '@/hooks/use-toast';
import { Send, Heart } from 'lucide-react';

export const CustomerReviews = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!api || reviews.length <= 1) return;

    const timer = setInterval(() => api.scrollNext(), 4000);
    return () => clearInterval(timer);
  }, [api]);

  const createReviewMutation = useMutation({
    mutationFn: () =>
      hokApi.createReview({
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        userName: displayName.trim() || undefined,
        userEmail: email.trim() || undefined,
      }),
    onSuccess: () => {
      toast({
        title: 'Review submitted',
        description: 'Thanks for sharing your experience!',
      });
      setRating(0);
      setHoverRating(0);
      setTitle('');
      setComment('');
      setDisplayName('');
      setEmail('');
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Unable to submit review',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: 'Select a rating',
        description: 'Tap a star rating before you submit.',
        variant: 'destructive',
      });
      return;
    }
    if (!comment.trim()) {
      toast({
        title: 'Add a short note',
        description: 'A quick comment helps shoppers understand your experience.',
        variant: 'destructive',
      });
      return;
    }
    createReviewMutation.mutate();
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-4 md:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            Don't just take our word for it. Here's what our valued customers have to say about their HOK Fashion experience.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="luxury"
                size="lg"
                className="px-7 mt-6 inline-flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Add Your Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="font-playfair text-2xl">Share your experience</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-3">
                    {stars.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(value)}
                        className="p-1"
                        aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            value <= (hoverRating || rating)
                              ? 'fill-red text-red drop-shadow-sm'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground">
                      {rating > 0 ? `${rating}/5` : 'Select a rating'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="general-review-title">Title (optional)</Label>
                  <Input
                    id="general-review-title"
                    placeholder="Headline for your review"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="general-review-comment">Your review</Label>
                  <Textarea
                    id="general-review-comment"
                    placeholder="Tell us about quality, feel, delivery, and style..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="general-review-name">Name</Label>
                    <Input
                      id="general-review-name"
                      placeholder="How should we address you?"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="general-review-email">Email</Label>
                    <Input
                      id="general-review-email"
                      type="email"
                      placeholder="We will not share this."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createReviewMutation.isPending}
                >
                  {createReviewMutation.isPending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Carousel opts={{ loop: true }} setApi={setApi} className="relative">
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
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

                    <p className="text-muted-foreground mb-6 font-inter leading-relaxed flex-1">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  );
};
