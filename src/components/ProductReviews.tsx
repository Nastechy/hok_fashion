import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { hokApi, Review, PaginatedResponse } from '@/services/hokApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Send, MessageSquare, Eye } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  initialData?: PaginatedResponse<Review> | Review[];
}

export const ProductReviews = ({ productId, productName, initialData }: ProductReviewsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => hokApi.fetchProductReviews(productId),
    enabled: Boolean(productId),
    initialData,
  });

  const reviews: Review[] = useMemo(() => (Array.isArray(data) ? data : data?.data ?? []), [data]);
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0;
  const reviewCount = reviews.length;

  const createReviewMutation = useMutation({
    mutationFn: () =>
      hokApi.createReview({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        userName: displayName || undefined,
        userEmail: email || undefined,
      }),
    onSuccess: () => {
      toast({
        title: 'Review submitted',
        description: 'Thanks for sharing your feedback!',
      });
      setRating(0);
      setHoverRating(0);
      setTitle('');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Unable to submit review',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating === 0) {
      toast({
        title: 'Select a rating',
        description: 'Tap the stars to rate this product before submitting.',
        variant: 'destructive',
      });
      return;
    }
    if (!comment.trim()) {
      toast({
        title: 'Add a quick note',
        description: 'A short comment helps other shoppers.',
        variant: 'destructive',
      });
      return;
    }

    createReviewMutation.mutate();
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 min-w-[180px]">
          <p className="text-sm font-semibold text-foreground">Product Reviews</p>
          <p className="text-xs text-muted-foreground">Share your experience with {productName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-red text-red' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {reviewCount > 0 ? `${averageRating.toFixed(1)}` : 'No ratings'}
            </span>
          </div>
          <Button variant="luxury" size="sm" onClick={() => setIsDialogOpen(true)}>
            Add product review
          </Button>
          <Button variant="outline" size="sm" className="truncate max-w-[180px]" onClick={() => setShowReviews((prev) => !prev)}>
            <Eye className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{showReviews ? 'Hide reviews' : 'View other reviews'}</span>
          </Button>
        </div>
      </div>

      {showReviews && (
        <div className="space-y-3 rounded-lg border border-border p-4 bg-background/70">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>No reviews yet. Be the first to share your thoughts.</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-border p-3 bg-background/70 space-y-2">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < Number(review.rating || 0) ? 'fill-red text-red' : 'text-muted-foreground'}`}
                      />
                    ))}
                    {review.title && <p className="text-sm font-semibold text-foreground">{review.title}</p>}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{review.userName || 'Anonymous'}</span>
                    {review.createdAt && <span>{new Date(review.createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl">Add your review</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
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
                        value <= (hoverRating || rating) ? 'fill-red text-red drop-shadow-sm' : 'text-muted-foreground'
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
              <Label htmlFor="review-title">Title (optional)</Label>
              <Input
                id="review-title"
                placeholder="Headline for your review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment">Your review</Label>
              <Textarea
                id="review-comment"
                placeholder="Tell us about quality, feel, and style..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            {!user && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="review-name">Name</Label>
                  <Input
                    id="review-name"
                    placeholder="How should we address you?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-email">Email</Label>
                  <Input
                    id="review-email"
                    type="email"
                    placeholder="We will not share this."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}

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
    </section>
  );
};
