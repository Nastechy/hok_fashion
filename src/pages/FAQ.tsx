import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const faqs = [
  {
    category: 'Care & Maintenance',
    qa: [
      {
        q: 'How do I clean my leather bag?',
        a: 'Wipe gently with a soft, slightly damp cloth. Use a pH-neutral leather cleaner occasionally. Avoid harsh chemicals and excessive water.',
      },
      {
        q: 'How do I store my bag?',
        a: 'Stuff with tissue to retain shape, keep in a breathable dust bag, and store upright away from direct sunlight or humidity.',
      },
      {
        q: 'Can I use hand sanitizer near my bag?',
        a: 'Avoid contact; alcohol can discolor or dry out leather. Let sanitizer dry before handling your bag.',
      },
    ],
  },
  {
    category: 'Delivery & Orders',
    qa: [
      {
        q: 'How long does delivery take?',
        a: 'Within Nigeria, 2-5 business days. Lagos/Abuja are typically faster. You’ll receive tracking once shipped.',
      },
      {
        q: 'Can I inspect on delivery?',
        a: 'Yes. We encourage you to inspect the item on delivery. If there is any issue, contact support immediately.',
      },
      {
        q: 'What should I do if I receive the wrong item?',
        a: 'Contact customer support within 24 hours with your order ID and photos. We’ll arrange a pickup and replacement or refund.',
      },
    ],
  },
  {
    category: 'Usage Tips',
    qa: [
      {
        q: 'How do I keep hardware shiny?',
        a: 'Wipe hardware with a dry microfiber cloth after use. Avoid perfumes/oils near hardware to prevent tarnish.',
      },
      {
        q: 'Is my bag water-resistant?',
        a: 'Our bags are not fully waterproof. If caught in rain, blot dry immediately with a clean cloth and air-dry in shade.',
      },
      {
        q: 'How do I avoid color transfer?',
        a: 'Be careful with dark denim and heavily dyed fabrics. Rotate carry sides and clean the bag lightly after use.',
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header selectedCategory="All" />
      <main className="container mx-auto px-4 lg:px-8 py-6 lg:py-12">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-inter">Support</p>
          <h1 className="text-4xl font-bold font-playfair mt-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
            Care tips, delivery details, and answers to keep your HOK bags flawless.
          </p>
        </div>

        <div className="grid gap-6">
          {faqs.map((section) => (
            <div key={section.category} className="rounded-xl border border-border bg-card shadow-card p-6">
              <h2 className="text-xl font-semibold font-playfair mb-4">{section.category}</h2>
              <div className="space-y-4">
                {section.qa.map((item) => (
                  <div key={item.q} className="space-y-1">
                    <p className="font-semibold text-foreground">{item.q}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
