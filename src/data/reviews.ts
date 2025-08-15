export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely love this tote! The quality is exceptional and it fits everything I need for work.',
    product: 'Classic Black Tote',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    name: 'Emily Chen',
    rating: 5,
    comment: 'Perfect size for everyday use. The leather is so soft and the design is timeless.',
    product: 'Beige Crossbody',
    date: '2024-01-10',
    verified: true
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    rating: 4,
    comment: 'Beautiful bag! Great quality and fast shipping. Will definitely order again.',
    product: 'Evening Clutch',
    date: '2024-01-08',
    verified: true
  },
  {
    id: '4',
    name: 'Jennifer Smith',
    rating: 5,
    comment: 'This is my third purchase from HOK Fashion. Always impressed with the quality!',
    product: 'Shoulder Bag Deluxe',
    date: '2024-01-05',
    verified: true
  },
  {
    id: '5',
    name: 'Lisa Park',
    rating: 5,
    comment: 'Exactly as described. Beautiful craftsmanship and arrived quickly. Highly recommend!',
    product: 'Brown Leather Tote',
    date: '2024-01-03',
    verified: true
  }
];