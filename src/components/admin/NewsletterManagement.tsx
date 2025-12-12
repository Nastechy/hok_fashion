import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hokApi, NewsletterSubscriber } from '@/services/hokApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const NewsletterManagement = () => {
  const [subject, setSubject] = useState('');
  const [preview, setPreview] = useState('');
  const [body, setBody] = useState('');
  const [ctaLink, setCtaLink] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-newsletter'],
    queryFn: () => hokApi.fetchNewsletterSubscribers(),
  });

  const subscribers: NewsletterSubscriber[] = data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Draft saved',
      description: 'Hook up the newsletter send API to deliver this message.',
    });
    setSubject('');
    setPreview('');
    setBody('');
    setCtaLink('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="font-playfair text-xl">Compose Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input
                placeholder="E.g., New arrivals drop — Abuja exclusives"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Preview text</label>
              <Input
                placeholder="One line teaser for inbox previews"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Body</label>
              <Textarea
                rows={6}
                placeholder="Write your story, feature products, and calls to action..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">CTA link (optional)</label>
              <Input
                placeholder="https://hokfashion.com/collections/new"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="luxury">
                Save Draft 
              </Button>
              <Button type="button" variant="outline" disabled>
                Send Newsletter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-card">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-playfair text-xl">Newsletter Subscribers</CardTitle>
          <button
            onClick={() => refetch()}
            className="text-sm text-primary hover:underline"
          >
            Refresh
          </button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading subscribers...</p>
          ) : error ? (
            <p className="text-sm text-destructive">Unable to load subscribers.</p>
          ) : subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscribers yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 bg-background/60"
                >
                  <span className="text-sm font-medium">{subscriber.email}</span>
                  {subscriber.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;
