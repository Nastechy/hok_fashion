import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const mockNewsletters = [
  {
    id: 'nl-001',
    title: 'Abuja Exclusive Drop',
    preview: 'New structured totes and clutches crafted for the Abuja heat.',
    date: '2024-12-05',
    link: '/collections/FEATURE',
    content: `Step into Abuja's festive season with lightweight structured totes built for the weather. We focused on breathable lining, reinforced handles, and a palette inspired by the city sunsets. Limited units available for this drop—secure yours before the next run.`,
    ctaLabel: 'Shop Feature Collection',
  },
  {
    id: 'nl-002',
    title: 'Holiday Gifting Edit',
    preview: 'Curated picks for end-of-year events with limited runs.',
    date: '2024-11-18',
    link: '/collections/BEST_SELLER',
    content: `Our gifting edit is tailored for office parties, weddings, and quick weekend getaways. Expect soft leathers, compact silhouettes, and bold hardware. These pieces are replenished slowly—gift early to avoid missing sizes and colors.`,
    ctaLabel: 'View Best Sellers',
  },
  {
    id: 'nl-003',
    title: 'Lagos Pop-Up Recap',
    preview: 'Highlights from the pop-up and what is restocking next.',
    date: '2024-10-02',
    link: '/lookbook',
    content: `Thank you, Lagos! We sold out of the croc-embossed minis and midnight clutches within hours. A restock is scheduled—add yourself to the lookbook alerts to see colorways and pairings from the event.`,
    ctaLabel: 'Browse the Lookbook',
  },
];

const Newsletter = () => {
  const [selected, setSelected] = useState<(typeof mockNewsletters)[number] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-10 py-10 lg:py-14 space-y-8">
        <div className="text-center space-y-3">
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-inter">Newsletter</p>
          <h1 className="text-4xl font-playfair font-bold text-foreground">Latest Posts</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Catch up on all posted newsletters. Live send functionality will connect to the admin sender once available.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockNewsletters.map((item) => (
            <Card key={item.id} className="border border-border shadow-card h-full">
              <CardHeader className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  {new Date(item.date).toLocaleDateString()}
                </Badge>
                <CardTitle className="font-playfair text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.preview}</p>
                <Button
                  variant="luxury"
                  className="text-sm hover:text-foreground"
                  onClick={() => setSelected(item)}
                >
                  View more
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-playfair text-2xl">{selected.title}</DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(selected.date).toLocaleDateString()}
                </p>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-foreground">{selected.content}</p>
                <Button asChild variant="luxury">
                  <a href={selected.link}>{selected.ctaLabel || 'View collection'}</a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Newsletter;
